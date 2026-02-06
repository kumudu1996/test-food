import React, { useState } from "react";

const Login = ({ onLogin, error }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="brand">
          <div className="badge">Delivery Console</div>
          <h1>Welcome back</h1>
          <p>Log in to manage live delivery updates.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              placeholder="delivery"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="primary">
            Log In
          </button>
        </form>
        <div className="hint">
          Default demo: <strong>delivery / delivery123</strong>
        </div>
      </div>
      <div className="login-visual">
        <div className="pulse"></div>
        <div className="card-stack">
          <div className="stack-card"></div>
          <div className="stack-card"></div>
          <div className="stack-card"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
