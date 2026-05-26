require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const sessionRoutes = require("./routes/sessions");
const chatRoutes = require("./routes/chat");
const safetyRoutes = require("./routes/safety");
const adminRoutes = require("./routes/admin");

const Message = require("./models/Message");
const Match = require("./models/Match");
const User = require("./models/User");

const { getRoomId } = require("./routes/chat");

// ── Environment Validation ──────────────────────────────────────────────────
if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL: JWT_SECRET environment variable is not set.");
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error("❌ FATAL: MONGO_URI environment variable is not set.");
  process.exit(1);
}

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

// ── Security Headers ────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl in dev)
    if (!origin) return callback(null, true);
    const isAllowed =
      allowedOrigins.includes(origin) ||
      (process.env.NODE_ENV !== "production" && /^http:\/\/localhost:\d+$/.test(origin));
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
};

// ── Rate Limiting ───────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Stricter for auth endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many auth attempts, please try again in 15 minutes." },
});

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json({ limit: "10kb" })); // Prevent large payload attacks
app.use(globalLimiter);

// ── DB Connection ───────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/safety", safetyRoutes);
app.use("/api/admin", adminRoutes);

// Health check (no auth, no sensitive info)
app.get("/", (req, res) => res.json({ status: "OK", service: "Companion API" }));

// ── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// ── SOCKET.IO ───────────────────────────────────────────────────────────────
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

// Online users map: userId -> socketId
const onlineUsers = new Map();

// Authenticate socket
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication required"));
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", async (socket) => {
  const userId = socket.userId;
  onlineUsers.set(userId, socket.id);

  // Update last seen
  await User.findByIdAndUpdate(userId, { lastSeen: new Date() });

  // Broadcast online status
  io.emit("userOnline", userId);
  console.log(`🟢 User ${userId} connected`);

  // Join personal room
  socket.join(`user_${userId}`);

  // ── SEND MESSAGE ────────────────────────────────────────────────────────
  socket.on("sendMessage", async ({ receiverId, matchId, content, type, mediaUrl, disappearsIn }) => {
    try {
      // Input validation
      if (!receiverId || !matchId) return;
      if (content && content.length > 2000) return socket.emit("error", { message: "Message too long" });

      const roomId = getRoomId(userId, receiverId);

      // Validate match exists and user is part of it
      const match = await Match.findById(matchId);
      if (!match || !match.users.map(String).includes(userId)) return;
      if (!match.users.map(String).includes(receiverId)) return;

      const expiresAt = disappearsIn
        ? new Date(Date.now() + Math.min(disappearsIn, 86400) * 1000) // Cap at 24h
        : undefined;

      const msg = new Message({
        roomId, sender: userId, receiver: receiverId,
        content, type: type || "text", mediaUrl, expiresAt,
      });
      await msg.save();
      await msg.populate("sender", "name profilePhoto");

      // Update match last message
      await Match.findByIdAndUpdate(matchId, {
        lastMessage: content || (type === "image" ? "📷 Photo" : "🎤 Voice"),
        lastMessageAt: new Date(),
      });

      // Emit to both users
      io.to(`user_${userId}`).emit("newMessage", msg);
      io.to(`user_${receiverId}`).emit("newMessage", msg);

      // Notification to receiver if offline
      if (!onlineUsers.has(receiverId)) {
        io.to(`user_${receiverId}`).emit("notification", {
          type: "message",
          from: userId,
          preview: content?.substring(0, 50) || "New message",
        });
      }
    } catch (err) {
      console.error("sendMessage error:", err.message);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // ── TYPING INDICATOR ──────────────────────────────────────────────────
  socket.on("typing", ({ receiverId, isTyping }) => {
    if (!receiverId) return;
    io.to(`user_${receiverId}`).emit("userTyping", { userId, isTyping });
  });

  // ── READ RECEIPT ──────────────────────────────────────────────────────
  socket.on("markRead", async ({ roomId, senderId }) => {
    if (!roomId || !senderId) return;
    await Message.updateMany({ roomId, sender: senderId, isRead: false }, { isRead: true });
    io.to(`user_${senderId}`).emit("messagesRead", { roomId, readBy: userId });
  });

  // ── SAFE CHECK-IN ─────────────────────────────────────────────────────
  socket.on("safeCheckIn", async ({ location }) => {
    try {
      const user = await User.findById(userId).select("name");
      if (user) {
        console.log(`✅ Safe check-in from ${user.name} at ${location}`);
      }
      socket.emit("checkInConfirmed", { timestamp: new Date(), location });
    } catch (err) {
      console.error("safeCheckIn error:", err.message);
    }
  });

  // ── DISCONNECT ────────────────────────────────────────────────────────
  socket.on("disconnect", async () => {
    onlineUsers.delete(userId);
    await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
    io.emit("userOffline", userId);
    console.log(`🔴 User ${userId} disconnected`);
  });
});

// Export io for use in routes
app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));