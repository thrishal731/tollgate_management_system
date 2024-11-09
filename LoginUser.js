import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';

function LoginUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To show error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error message

    try {
      const response = await axios.post("http://localhost:5000/login-user", {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Save token to localStorage
        navigate("/user_home"); // Redirect to user home page
      } else {
        setErrorMessage("Login failed: No token returned"); // Handle case when no token is returned
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Invalid credentials, please try again"); // Display error message
    }
  };

  return (
    <div className="login-container">
      <h1>Login as User</h1>
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
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      
      {/* Link to Register page */}
      <Link to="/register-user">Don't have an account? Register here</Link>
    </div>
  );
}

export default LoginUser;
