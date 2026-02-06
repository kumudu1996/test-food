import React from "react";

const StatusStepper = ({ status }) => {
  const isDelivered = status === "Delivered";
  return (
    <div className="stepper">
      <div className={`step ${isDelivered ? "done" : "active"}`}>
        <span className="dot"></span>
        <span className="text">Out for delivery</span>
      </div>
      <div className={`line ${isDelivered ? "done" : ""}`}></div>
      <div className={`step ${isDelivered ? "done" : ""}`}>
        <span className="dot"></span>
        <span className="text">Delivered</span>
      </div>
    </div>
  );
};

export default StatusStepper;
