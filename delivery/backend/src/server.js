import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(cors({ origin: ["http://localhost:5176", "http://localhost:5173"] }));
app.use(express.json());

const PORT = process.env.PORT || 8090;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "food_delivery_db";
const DELIVERY_USER = process.env.DELIVERY_USER || "delivery";
const DELIVERY_PASS = process.env.DELIVERY_PASS || "delivery123";

const tokenStore = new Set();

const client = new MongoClient(MONGO_URL);
let isConnected = false;

const getOrdersCollection = async () => {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
  return client.db(DB_NAME).collection("orders");
};

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");
  if (!tokenStore.has(token)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return next();
};

app.post("/api/delivery/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === DELIVERY_USER && password === DELIVERY_PASS) {
    const token = crypto.randomBytes(24).toString("hex");
    tokenStore.add(token);
    return res.json({ token, user: { username } });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

app.get("/api/delivery/orders", authMiddleware, async (req, res) => {
  const status = req.query.status || "Out for delivery";
  const orders = await (await getOrdersCollection())
    .find({ orderStatus: status })
    .sort({ deliveryUpdatedAt: -1 })
    .toArray();
  res.json(orders);
});

app.patch("/api/delivery/orders/:id/status", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }
  const result = await (await getOrdersCollection()).updateOne(
    { _id: id },
    { $set: { orderStatus: status } }
  );
  if (!result.matchedCount) {
    return res.status(404).json({ message: "Order not found" });
  }
  return res.json({ success: true });
});

app.patch("/api/delivery/orders/:id/location", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { location, lat, lng } = req.body || {};
  if (!location && (lat == null || lng == null)) {
    return res.status(400).json({ message: "Location is required" });
  }
  const payload = {
    deliveryLocation: location || `${lat}, ${lng}`,
    deliveryLat: lat ?? null,
    deliveryLng: lng ?? null,
    deliveryUpdatedAt: Date.now()
  };
  const historyEntry = {
    location: payload.deliveryLocation,
    lat: payload.deliveryLat,
    lng: payload.deliveryLng,
    updatedAt: payload.deliveryUpdatedAt
  };
  const result = await (await getOrdersCollection()).updateOne(
    { _id: id },
    {
      $set: payload,
      $push: { deliveryLocations: { $each: [historyEntry], $slice: -3 } }
    }
  );
  if (!result.matchedCount) {
    return res.status(404).json({ message: "Order not found" });
  }
  return res.json({ success: true, ...payload });
});

app.get("/api/delivery/orders/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const order = await (await getOrdersCollection()).findOne({ _id: id });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  return res.json(order);
});

app.listen(PORT, () => {
  console.log(`Delivery backend running on http://localhost:${PORT}`);
});
