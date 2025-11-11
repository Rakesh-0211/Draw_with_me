const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Rooms } = require("./rooms");

const app = express();
const server = http.createServer(app);

// Allow WebSockets & CORS
const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Render gives dynamic PORT
const PORT = process.env.PORT || 3000;
const rooms = new Rooms();

// Color palette for users
const COLORS = [
  "#ef4444", "#f59e0b", "#10b981", "#3b82f6",
  "#a855f7", "#ec4899", "#22c55e", "#eab308", "#06b6d4"
];

// Serve static client files
app.use("/client", express.static(path.join(__dirname, "..", "client")));

// Serve main page
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// Socket.IO logic
io.on("connection", (socket) => {
  let roomId = null;
  let user = null;

  socket.on("presence:join", ({ roomId: rid, name }) => {
    roomId = String(rid || "lobby");
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    user = { id: socket.id, name: name || "Anonymous", color };
    rooms.addUser(roomId, user);
    socket.join(roomId);

    socket.emit("presence:state", { users: rooms.userList(roomId), selfId: socket.id });
    const { state } = rooms.ensure(roomId);
    socket.emit("state:replace", state.snapshot());

    socket.to(roomId).emit("presence:state", { users: rooms.userList(roomId) });
  });

  socket.on("cursor:update", ({ x, y }) => {
    if (!roomId) return;
    const { state } = rooms.ensure(roomId);
    state.cursors[socket.id] = { x, y };
    const users = rooms.userList(roomId);
    io.to(roomId).emit("cursor:state", { cursors: state.cursors, users });
  });

  socket.on("stroke:start", ({ tempId, color, width, mode }) => {
    if (!roomId) return;
    socket.to(roomId).emit("stroke:remoteStart", { userId: socket.id, tempId, color, width, mode });
    socket.data.liveStroke = { tempId, color, width, mode, points: [] };
  });

  socket.on("stroke:point", ({ tempId, x, y }) => {
    if (!roomId) return;
    socket.to(roomId).emit("stroke:remotePoint", { tempId, x, y });
    if (socket.data.liveStroke && socket.data.liveStroke.tempId === tempId) {
      socket.data.liveStroke.points.push({ x, y });
    }
  });

  socket.on("stroke:end", ({ tempId }) => {
    if (!roomId) return;
    socket.to(roomId).emit("stroke:remoteEnd", { tempId });
    const live = socket.data.liveStroke;
    if (live && live.tempId === tempId) {
      const { state } = rooms.ensure(roomId);
      const op = state.commitOp({ ...live, userId: socket.id });
      io.to(roomId).emit("op:commit", { op });
      socket.data.liveStroke = null;
    }
  });

  socket.on("op:undo", () => {
    if (!roomId) return;
    const { state } = rooms.ensure(roomId);
    if (state.undo()) {
      state.replaceState(io, roomId);
    }
  });

  socket.on("op:redo", () => {
    if (!roomId) return;
    const { state } = rooms.ensure(roomId);
    if (state.redoOp()) {
      state.replaceState(io, roomId);
    }
  });

  // 🧹 Handle canvas clear for all users in the same room
  socket.on("canvas:clear", () => {
    if (!roomId) return;
    const { state } = rooms.ensure(roomId);
    state.ops = [];   // remove all drawings
    state.redo = [];  // reset redo stack
    io.to(roomId).emit("state:replace", { ops: [] }); // broadcast empty state
  });

  socket.on("disconnect", () => {
    if (roomId && user) {
      rooms.removeUser(roomId, user.id);
      io.to(roomId).emit("presence:state", { users: rooms.userList(roomId) });
    }
  });
});

// ✅ Bind for Render / Local
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`👉 Open http://localhost:${PORT}`);
});
