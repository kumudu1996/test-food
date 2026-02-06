import React, { useEffect, useMemo, useState } from "react";
import { assets } from "../../assets/assets";
import { fetchOrdersByStatus } from "../../services/orderService";
import { toast } from "react-toastify";
import "./Delivery.css";

const Delivery = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDeliveryOrders = async () => {
    try {
      setLoading(true);
      const response = await fetchOrdersByStatus("Out for delivery");
      setOrders(response);
    } catch (error) {
      toast.error("Unable to load delivery orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryOrders();
    const interval = setInterval(fetchDeliveryOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const rows = useMemo(() => orders, [orders]);

  const getRecentLocations = (order) => {
    if (Array.isArray(order.deliveryLocations) && order.deliveryLocations.length > 0) {
      return order.deliveryLocations.slice(-3);
    }
    if (order.deliveryLocation) {
      return [
        {
          location: order.deliveryLocation,
          updatedAt: order.deliveryUpdatedAt
        }
      ];
    }
    return [];
  };

  const getProgressFill = (order) => {
    const count = getRecentLocations(order).length;
    return Math.min(3, count);
  };

  const renderSteps = (orderStatus, order) => {
    const isDelivered = orderStatus === "Delivered";
    const locations = getRecentLocations(order);
    const timelinePoints = [
      {
        label: "Food preparing",
        sub: null,
        done: true
      },
      {
        label: "Out for delivery",
        sub: null,
        done: true
      },
      ...locations.map((loc, idx) => ({
        label: loc.location,
        sub: loc.updatedAt ? new Date(loc.updatedAt).toLocaleString() : null,
        done: true,
        key: `loc-${idx}`
      })),
      {
        label: "Delivered",
        sub: null,
        done: isDelivered
      }
    ];
    return (
      <div className="delivery-timeline">
        {timelinePoints.map((point, idx) => {
          const isLast = idx === timelinePoints.length - 1;
          const pointKey = point.key || point.label;
          return (
            <div className="timeline-point" key={pointKey}>
              <div className={`dot ${point.done ? "done" : "pending"}`}></div>
              {!isLast && (
                <div className={`line ${point.done ? "done" : ""}`}></div>
              )}
              <div className="label">{point.label}</div>
              {point.sub && <div className="sub">{point.sub}</div>}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="py-5 row justify-content-center">
        <div className="col-11 card">
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="mb-0">Delivery Orders</h5>
            <button className="btn btn-outline-secondary btn-sm" onClick={fetchDeliveryOrders}>
              Refresh
            </button>
          </div>
          {loading && (
            <div className="p-3 text-muted">Loading orders...</div>
          )}
          {!loading && rows.length === 0 && (
            <div className="p-3 text-muted">No orders are out for delivery.</div>
          )}
          {!loading && rows.length > 0 && (
            <table className="table table-responsive">
              <tbody>
                {rows.map((order, index) => (
                  <tr key={order.id ?? index}>
                    <td>
                      <img src={assets.parcel} alt="" height={48} width={48} />
                    </td>
                    <td>
                      <div>
                        {order.orderedItems.map((item, itemIndex) => {
                          if (itemIndex === order.orderedItems.length - 1) {
                            return item.name + " x " + item.quantity;
                          }
                          return item.name + " x " + item.quantity + ", ";
                        })}
                      </div>
                      <div>{order.userAddress}</div>
                      <div className="text-muted small">
                        {order.phoneNumber}
                      </div>
                    </td>
                    <td>&#x20B9;{order.amount.toFixed(2)}</td>
                    <td>
                      {renderSteps(order.orderStatus, order)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Delivery;
