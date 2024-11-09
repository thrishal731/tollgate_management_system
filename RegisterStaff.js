import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterStaff() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous errors

    try {
      const response = await axios.post("http://localhost:5000/register-staff", {
        username,
        password,
      });

      // Registration success - redirect to login page
      navigate("/login-staff");
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage("Registration failed, please try again.");
    }
  };

  return (
    <div className="register-container">
      <h1>Register as Staff</h1>
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
        <button type="submit">Register</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}

export default RegisterStaff;
