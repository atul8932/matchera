const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // always 2 users
    compatibilityScore: { type: Number, default: 0 },
    sharedIntents: [String],
    sharedInterests: [String],
    isActive: { type: Boolean, default: true },
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", MatchSchema);
