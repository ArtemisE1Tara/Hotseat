const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(cors());

const chairs = Array(10).fill({ occupied: false }); // Initial occupancy of 10 chairs

// API route to get initial data
app.get("/api/occupancy", (req, res) => {
  res.json(chairs);
});

// API route to update chair data
app.post("/api/occupancy", (req, res) => {
    const { id, occupied } = req.body;
    console.log(`Received data - Chair ID: ${id}, Occupied: ${occupied}`);
  
    if (id >= 0 && id < chairs.length) {
      chairs[id] = { occupied };
      console.log("Updated chairs:", chairs);  // Log the current state of chairs
      io.emit("occupancyUpdate", { id, occupied });  // Emit real-time update to all clients
      res.status(200).json({ status: "updated" });
    } else {
      res.status(400).json({ error: "Invalid chair ID" });
    }
  });
  

// Start the server
server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
