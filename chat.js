const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors()); // Allow CORS requests

const allowedOrigins = [
  "http://localhost:5173", // Example: Frontend 1
  "https://lagchat.vercel.app", // Example: Frontend 2
  // "https://your-production-site.com"  // Production URL
];

const io = new Server(server, {
  cors: {
    // origin: "https://lagchat.vercel.app", // Change to a specific URL
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error("Not allowed by CORS")); // Reject the connection
      }
    },
    methods: ["GET", "POST"],
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
