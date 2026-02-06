import React, { useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { login } from "./api.js";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("delivery_token"));
  const [error, setError] = useState("");

  const handleLogin = async (username, password) => {
    try {
      setError("");
      const data = await login(username, password);
      localStorage.setItem("delivery_token", data.token);
      setToken(data.token);
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("delivery_token");
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} error={error} />;
  }

  return <Dashboard token={token} onLogout={handleLogout} />;
};

export default App;
