const { Server, Socket } = require("socket.io");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const server = require(".");
const app = express();

const io = new Server(server, {
  cors: { origin: "http://localhost:5173/chat" }, // Allow frontend access
});

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   // Listen for a message from a client
//   Socket.on("send_message", (data) => {
//     console.log(`Message from ${socket.id}: ${data}`);
//     io.emit("receive_message", data); // Send message to all clients
//   });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });
io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);
  socket.emit("connection_success", "Connected to server! 🎉"); // Send message to frontend

  // Listen for messages from the client
  socket.on("send_message", (msg) => {
    console.log(`📩 Message from ${socket.id}: ${msg}`);
    io.emit("receive_message", msg);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

module.exports = app;
