import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginStaff() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login-staff", {
        username,
        password,
      });

      // Save the JWT token in local storage
      localStorage.setItem("token", response.data.token);

      // Redirect to the staff dashboard (or any page)
      navigate("/staff-dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <h1>Login as Staff</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginStaff;
