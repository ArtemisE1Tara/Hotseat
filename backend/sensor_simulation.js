const axios = require("axios");

const API_URL = "http://localhost:4000/api/occupancy";

function simulateSensorData() {
  setInterval(() => {
    // Generate a random chair ID between 0 and 9
    const chairId = Math.floor(Math.random() * 10);

    // Randomly decide if the chair is occupied (50% chance)
    const occupied = Math.random() < 0.5;

    console.log(`Simulating: Chair ${chairId} is ${occupied ? "Occupied" : "Empty"}`);

    // Send the random occupancy data to the backend API
    axios.post(API_URL, { id: chairId, occupied })
      .then(response => {
        console.log(`Response: ${response.data.status}`);
      })
      .catch(error => {
        console.error("Error sending data:", error);
      });
  }, 1000);  // Send a random update every 2 seconds
}

simulateSensorData();
