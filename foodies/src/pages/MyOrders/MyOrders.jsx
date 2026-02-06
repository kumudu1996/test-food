import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import "./MyOrders.css";
import { fetchUserOrders } from "../../service/orderService";

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await fetchUserOrders(token);
    setData(response);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="container page-section">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 card p-4 glass-surface">
          <h3 className="mb-4 section-title">My Orders</h3>
          <table className="table table-responsive align-middle">
            <tbody>
              {data.map((order, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <img
                        src={assets.delivery}
                        alt=""
                        height={48}
                        width={48}
                      />
                    </td>
                    <td>
                      {order.orderedItems.map((item, index) => {
                        if (index === order.orderedItems.length - 1) {
                          return item.name + " x " + item.quantity;
                        } else {
                          return item.name + " x " + item.quantity + ", ";
                        }
                      })}
                    </td>
                    <td>&#x20B9;{order.amount.toFixed(2)}</td>
                    <td>Items: {order.orderedItems.length}</td>
                    <td className="fw-bold text-capitalize">
                      &#x25cf;{order.orderStatus}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={fetchOrders}
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
