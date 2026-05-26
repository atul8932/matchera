const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, index: true }, // e.g., userId1_userId2 (sorted)
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String },
    type: { type: String, enum: ["text", "image", "voice"], default: "text" },
    mediaUrl: { type: String },
    isRead: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    expiresAt: { type: Date }, // disappearing messages
  },
  { timestamps: true }
);

// TTL index for disappearing messages
MessageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Message", MessageSchema);
