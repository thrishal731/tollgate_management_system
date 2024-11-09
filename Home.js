// Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to the Toll Gate Management System</h1>
      <div className="button-group">
        <button onClick={() => navigate("/emergency-services")}>Emergency Services</button>
        <button onClick={() => navigate("/fare")}>Fare</button>
        <button onClick={() => navigate("/login-user")}>Login as User</button>
        <button onClick={() => navigate("/login-staff")}>Login as Staff</button>
        <button onClick={() => navigate("/login-admin")}>Login as Admin</button>
      </div>
    </div>
  );
}

export default Home;
