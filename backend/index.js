const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

// Serve static files
app.use(express.json());

// Simulated in-memory storage for chair occupancy data
let chairs = Array(10).fill({ occupied: false });

// API endpoint to get chair occupancy
app.get("/api/occupancy", (req, res) => {
  res.json(chairs);
});

// API endpoint to update chair occupancy
app.post("/api/occupancy", (req, res) => {
  const { id, occupied } = req.body;
  if (id >= 0 && id < chairs.length) {
    chairs[id] = { occupied };
    io.emit("occupancyUpdate", { id, occupied });
    res.status(200).json({ status: "updated" });
  } else {
    res.status(400).json({ error: "Invalid chair ID" });
  }
});

// Socket.io connection for real-time updates
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

// Start server
server.listen(4000, () => {
  console.log("Backend server running on port 4000");
});

