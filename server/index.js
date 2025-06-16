
require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const http    = require("http");
const { Server } = require("socket.io");

const app = express();

const FRONTEND_ORIGIN = process.env.ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,         
  })
);

app.get("/", (_, res) => res.send("🎉  Backend up and running"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`🔌  User connected → ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`🏠  ${socket.id} joined room ${room}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`❌  User disconnected → ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀  Server listening on port ${PORT}`);
});
