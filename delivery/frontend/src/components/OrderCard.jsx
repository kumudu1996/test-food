import React, { useState } from "react";
import StatusStepper from "./StatusStepper.jsx";

const OrderCard = ({
  order,
  onDeliver,
  onLocationUpdate,
  isUpdating
}) => {
  const [location, setLocation] = useState(order.deliveryLocation || "");

  const handleLocationSubmit = (event) => {
    event.preventDefault();
    onLocationUpdate(order._id, { location });
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      return onLocationUpdate(order._id, { location: "GPS not supported" });
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationUpdate(order._id, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          location: `Lat ${pos.coords.latitude.toFixed(5)}, Lng ${pos.coords.longitude.toFixed(5)}`
        });
      },
      () => onLocationUpdate(order._id, { location: "GPS permission denied" })
    );
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <div>
          <div className="order-id">Order #{order._id}</div>
          <div className="order-address">{order.userAddress}</div>
          <div className="order-phone">{order.phoneNumber}</div>
        </div>
        <div className="order-amount">Rs.{Number(order.amount || 0).toFixed(2)}</div>
      </div>

      <div className="order-items">
        {(order.orderedItems || []).map((item, idx) => (
          <div key={`${item.name}-${idx}`} className="item">
            <span>{item.name}</span>
            <span>x {item.quantity}</span>
          </div>
        ))}
      </div>

      <StatusStepper status={order.orderStatus} />

      <form className="location-form" onSubmit={handleLocationSubmit}>
        <input
          type="text"
          placeholder="Update current location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
        <button type="button" className="ghost" onClick={handleUseGPS}>
          Use GPS
        </button>
        <button type="submit" disabled={isUpdating}>
          Update Location
        </button>
      </form>

      <div className="order-actions">
        <button
          className="deliver"
          onClick={() => onDeliver(order._id)}
          disabled={order.orderStatus === "Delivered" || isUpdating}
        >
          Mark Delivered
        </button>
        {order.deliveryUpdatedAt && (
          <span className="updated">
            Updated: {new Date(order.deliveryUpdatedAt).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
