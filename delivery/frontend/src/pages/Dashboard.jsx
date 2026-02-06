import React, { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard.jsx";
import { fetchOrders, updateOrderLocation, updateOrderStatus } from "../api.js";

const Dashboard = ({ token, onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchOrders(token);
      setOrders(data);
    } catch (err) {
      setError("Unable to load orders. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDeliver = async (orderId) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(token, orderId, "Delivered");
      await loadOrders();
    } catch (err) {
      setError("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLocation = async (orderId, payload) => {
    try {
      setUpdatingId(orderId);
      await updateOrderLocation(token, orderId, payload);
      await loadOrders();
    } catch (err) {
      setError("Failed to update location.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="dashboard">
      <header className="topbar">
        <div>
          <div className="title">Delivery Live Queue</div>
          <div className="subtitle">Out for delivery → Delivered</div>
        </div>
        <div className="actions">
          <button className="ghost" onClick={loadOrders}>
            Refresh
          </button>
          <button className="ghost" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading">Loading delivery orders...</div>
      ) : orders.length === 0 ? (
        <div className="empty">No orders are out for delivery.</div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onDeliver={handleDeliver}
              onLocationUpdate={handleLocation}
              isUpdating={updatingId === order._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
