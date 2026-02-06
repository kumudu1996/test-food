import axios from "axios";

const API_BASE = "http://localhost:8090/api/delivery";

export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE}/login`, { username, password });
  return response.data;
};

export const fetchOrders = async (token, status = "Out for delivery") => {
  const response = await axios.get(`${API_BASE}/orders`, {
    params: { status },
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateOrderStatus = async (token, orderId, status) => {
  const response = await axios.patch(
    `${API_BASE}/orders/${orderId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateOrderLocation = async (token, orderId, payload) => {
  const response = await axios.patch(
    `${API_BASE}/orders/${orderId}/location`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
