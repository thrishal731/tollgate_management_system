import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", { username, password });
      const { token, role } = response.data;

      if (role === "admin") {
        localStorage.setItem("token", token); // Store token in local storage
        navigate("/admin-dashboard");
      } else {
        setError("Invalid credentials for admin.");
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : "Login failed.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login as Admin</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginAdmin;
