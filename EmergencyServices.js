import React, { useState, useEffect } from "react";
import axios from "axios";

function EmergencyServices() {
  const [tollgateName, setTollgateName] = useState("MainTollgate"); // Default tollgate
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
          setError("No authentication token found.");
          return;
        }

        console.log("Token:", token); // Debug: Log the token to ensure it's available

        const response = await axios.get(`http://localhost:5000/emergency-services/${tollgateName}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to the Authorization header
          },
        });

        if (response.data && response.data.length > 0) {
          setServices(response.data); // Set the services data if response is valid
        } else {
          setServices([]); // Set empty if no services found
        }
      } catch (error) {
        // Error handling for various failure types
        if (error.response) {
          setError(`Error: ${error.response.data.message || error.response.statusText}`);
          console.error("Response error:", error.response); // Debug: Log the response error
        } else if (error.request) {
          setError("Error: No response received from the server.");
          console.error("Request error:", error.request); // Debug: Log the request error
        } else {
          setError(`Error: ${error.message}`);
          console.error("General error:", error.message); // Debug: Log the general error
        }
      }
    };

    if (tollgateName) {
      fetchServices(); // Fetch services whenever tollgateName changes
    }
  }, [tollgateName]); // Dependency array to re-run when tollgateName changes

  return (
    <div>
      <h2>Emergency Services at {tollgateName}</h2>
      <input
        type="text"
        value={tollgateName}
        onChange={(e) => setTollgateName(e.target.value)}
        placeholder="Enter Tollgate Name"
      />
      {error && <p>{error}</p>}
      <ul>
        {services.length > 0 ? (
          services.map((service, index) => (
            <li key={index}>
              {service.service_type} - {service.service_address}
            </li>
          ))
        ) : (
          <li>No emergency services found for this tollgate.</li>
        )}
      </ul>
    </div>
  );
}

export default EmergencyServices;
