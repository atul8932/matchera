const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: ["walking", "travel", "food", "dating", "work-study", "casual-dating", "fitness", "events"],
      required: true,
    },
    location: {
      city: { type: String, required: true },
      venue: { type: String },
      coordinates: { type: [Number] }, // [lng, lat]
    },
    time: { type: Date, required: true },
    budget: { type: String, enum: ["budget", "moderate", "premium"], default: "moderate" },
    maxParticipants: { type: Number, default: 1 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    requests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, enum: ["open", "closed", "completed", "cancelled"], default: "open" },
    tags: [String],
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", SessionSchema);