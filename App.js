import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from './components/Home';
import EmergencyServices from './components/EmergencyServices';
import Fare from './components/Fare';
import LoginUser from './components/LoginUser';
import LoginStaff from './components/LoginStaff';
import LoginAdmin from './components/LoginAdmin';
import UserHome from './components/UserHome';
import StaffHome from './components/StaffHome';
import RegisterUser from './components/RegisterUser';
import './App.css';

// Check if the user is authenticated by checking for the JWT token in localStorage
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
    const expiry = decoded.exp * 1000;
    if (expiry < Date.now()) {
      localStorage.removeItem("token"); // Remove token if expired
      return false;
    }
    return true;
  }
  return false;
};

// Check the role of the authenticated user
const getRole = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
    return decoded.role; // Assuming the role is saved in the token
  }
  return null;
};

// PrivateRoute component to protect routes
const PrivateRoute = ({ children, redirectTo, allowedRoles }) => {
  const role = getRole();
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-user" element={<LoginUser />} />
        <Route path="/login-staff" element={<LoginStaff />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/register-user" element={<RegisterUser />} />
        
        <Route path="/user-home" element={<PrivateRoute redirectTo="/login-user" allowedRoles={['user']}>
          <UserHome />
        </PrivateRoute>} />

        <Route path="/staff-home" element={<PrivateRoute redirectTo="/login-staff" allowedRoles={['staff']}>
          <StaffHome />
        </PrivateRoute>} />
        
        <Route path="/emergency-services" element={<PrivateRoute redirectTo="/login-user" allowedRoles={['user', 'staff', 'admin']}>
          <EmergencyServices />
        </PrivateRoute>} />

        <Route path="/fare" element={<PrivateRoute redirectTo="/login-user" allowedRoles={['user', 'staff', 'admin']}>
          <Fare />
        </PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
