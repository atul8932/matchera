const router = require("express").Router();
const Message = require("../models/Message");
const Match = require("../models/Match");
const { verifyToken } = require("./auth");

// Helper: get roomId from two user IDs (sorted for consistency)
const getRoomId = (a, b) => [a, b].sort().join("_");

// GET /api/chat/conversations/all - List all conversations
// IMPORTANT: Must be before /:matchId to avoid Express matching "conversations" as a matchId
router.get("/conversations/all", verifyToken, async (req, res) => {
  try {
    const matches = await Match.find({ users: req.userId, isActive: true })
      .populate("users", "name profilePhoto age intents mood lastSeen isVerified")
      .sort("-updatedAt");

    // For each match, attach unread count
    const conversations = await Promise.all(
      matches.map(async (m) => {
        const otherId = m.users.find((u) => u._id.toString() !== req.userId);
        const roomId = getRoomId(req.userId, otherId?._id?.toString() || "");
        const unreadCount = await Message.countDocuments({
          roomId,
          receiver: req.userId,
          isRead: false,
        });
        return { ...m.toObject(), unreadCount };
      })
    );

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// GET /api/chat/:matchId/messages
router.get("/:matchId/messages", verifyToken, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);
    if (!match || !match.users.includes(req.userId)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const otherId = match.users.find((u) => u.toString() !== req.userId);
    const roomId = getRoomId(req.userId, otherId.toString());

    const messages = await Message.find({ roomId, isDeleted: false })
      .populate("sender", "name profilePhoto")
      .sort("createdAt")
      .limit(100);

    // Mark messages as read
    await Message.updateMany(
      { roomId, receiver: req.userId, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});


module.exports = router;
module.exports.getRoomId = getRoomId;
