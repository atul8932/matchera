const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reported: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: {
      type: String,
      enum: ["fake-profile", "harassment", "spam", "inappropriate-content", "scam", "underage", "other"],
      required: true,
    },
    description: { type: String },
    status: { type: String, enum: ["pending", "reviewed", "resolved", "dismissed"], default: "pending" },
    adminNote: { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const RatingSchema = new mongoose.Schema(
  {
    rater: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rated: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, maxlength: 300 },
    tags: [{ type: String, enum: ["punctual", "friendly", "safe", "fun", "professional", "respectful"] }],
  },
  { timestamps: true }
);

module.exports = {
  Report: mongoose.model("Report", ReportSchema),
  Rating: mongoose.model("Rating", RatingSchema),
};
