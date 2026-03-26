require("dotenv").config();
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");
const { validateEnv } = require("./config/env");
const { initSocket } = require("./utils/socket");

const PORT = Number(process.env.PORT || 5000);

const bootstrap = async () => {
  validateEnv();
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Unauthorized"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      return next();
    } catch (error) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(String(socket.userId));

    socket.on("chat:join", ({ requestId }) => {
      socket.join(String(requestId));
    });

    socket.on("chat:leave", ({ requestId }) => {
      socket.leave(String(requestId));
    });
  });

  initSocket(io);

  server.listen(PORT, () => {
    console.log(`Server started successfully on port ${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to bootstrap server:", error);
  process.exit(1);
});
