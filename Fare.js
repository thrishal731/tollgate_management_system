import React, { useState, useEffect } from "react";
import axios from "axios";

function Fare() {
  const [tollgateName, setTollgateName] = useState("MainTollgate");
  const [fare, setFare] = useState([]);

  useEffect(() => {
    const fetchFare = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/fare/${tollgateName}`);
        setFare(response.data);
      } catch (error) {
        console.error("Error fetching fare information:", error);
      }
    };

    fetchFare();
  }, [tollgateName]);

  return (
    <div>
      <h2>Fare Information at {tollgateName}</h2>
      <ul>
        {fare.map((f) => (
          <li key={f.id}>Fare: ${f.fare_amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default Fare;
