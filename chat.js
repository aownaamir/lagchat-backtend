const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors()); // Allow CORS requests

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Change to frontend URL
    // methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`🟢 New client connected: ${socket.id}`);
  socket.emit("connection_success", "Connected to the WebSocket server! 🎉");

  socket.on("disconnect", () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });

  socket.on("send_message", (message) => {
    console.log(`📩 Received message: ${message}`);
    io.emit("receive_message", message); // Emit the message back to all clients
  });
});

server.listen(5000, () => console.log("🚀 Server running on port 5000"));
