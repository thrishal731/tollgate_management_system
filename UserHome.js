import React, { useState, useEffect } from "react";
import axios from "axios";

function UserHome() {
  const [vehicleNumber, setVehicleNumber] = useState(""); // State to hold vehicle registration number
  const [tollHistory, setTollHistory] = useState([]); // State to hold toll history
  const [error, setError] = useState(""); // State to hold error message
  const [loading, setLoading] = useState(false); // State to manage loading state

  // Function to fetch toll history
  const fetchTollHistory = async () => {
    setLoading(true); // Start loading
    setError(""); // Clear any previous error
    setTollHistory([]); // Clear previous toll history

    try {
      const token = localStorage.getItem("token"); // Get JWT token from localStorage
      console.log("Token:", token); // Log token for debugging

      if (!token) {
        setError("Please log in first.");
        setLoading(false); // Stop loading
        return; // Stop execution if no token is found
      }

      // Making API request to fetch toll history
      const response = await axios.get("http://localhost:5000/toll-history", {
        headers: { Authorization: `Bearer ${token}` },
        params: { vehicle_registration_number: vehicleNumber }, // Pass the vehicle registration number as a query param
      });

      console.log("API Response:", response.data); // Log the API response

      // Check if the response data is empty
      if (response.data.length === 0) {
        setError("No toll history found for this vehicle.");
      } else {
        setTollHistory(response.data); // Set the toll history state
      }
    } catch (error) {
      console.error("Error fetching toll history:", error); // Log error for debugging
      setError("Failed to fetch toll history. Please try again.");
      setTollHistory([]); // Clear the toll history on error
    } finally {
      setLoading(false); // Stop loading after the request finishes
    }
  };

  // Optionally, log toll history whenever it updates
  useEffect(() => {
    console.log("Toll History:", tollHistory); // Log toll history for debugging
  }, [tollHistory]);

  return (
    <div>
      <h1>User Home</h1>
      <div>
        <input
          type="text"
          placeholder="Enter Vehicle Registration Number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)} // Update state on input change
        />
        <button onClick={fetchTollHistory} disabled={loading}>
          {loading ? "Loading..." : "Check Toll History"} {/* Show loading state */}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}

      {/* Display toll history if available */}
      {tollHistory.length > 0 && (
        <div>
          <h2>Toll History</h2>
          <ul>
            {tollHistory.map((entry) => (
              <li key={entry.id}>
                <p>Tollgate: {entry.tollgate_name}</p>
                <p>Amount: {entry.toll_amount}</p>
                <p>Date: {new Date(entry.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display a message when no toll history is available */}
      {tollHistory.length === 0 && !error && !loading && <p>No toll history available.</p>}
    </div>
  );
}

export default UserHome;
