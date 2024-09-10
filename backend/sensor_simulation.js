const axios = require("axios");
const random = require("random");

const API_URL = "http://localhost:4000/api/occupancy";

function simulateSensorData() {
  setInterval(() => {
    const chairId = random.int(0, 9);
    const occupied = random.boolean();
    axios.post(API_URL, { id: chairId, occupied })
      .then(response => console.log(`Sent: Chair ${chairId} ${occupied ? "Occupied" : "Empty"}`))
      .catch(error => console.error(error));
  }, 2000); // Send every 2 seconds
}

simulateSensorData();
