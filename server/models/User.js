const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String },
    age: { type: Number, min: 18, max: 60 },
    gender: { type: String, enum: ["male", "female", "non-binary", "prefer-not"] },
    profilePhoto: { type: String, default: "" },
    photos: [{ type: String }],
    bio: { type: String, maxlength: 500 },
    location: {
      city: { type: String },
      coordinates: { type: [Number], index: "2dsphere" }, // [lng, lat]
    },
    intents: [
      {
        type: String,
        enum: ["walking", "travel", "food", "dating", "work-study", "casual-dating", "fitness", "events"],
      },
    ],
    interests: [{ type: String }],
    personalityTags: [{ type: String }],
    availability: {
      now: { type: Boolean, default: false },
      tonight: { type: Boolean, default: false },
      weekend: { type: Boolean, default: false },
    },
    mood: { type: String, enum: ["chill", "adventurous", "professional", "romantic"], default: "chill" },
    budget: { type: String, enum: ["budget", "moderate", "premium"], default: "moderate" },

    // Verification
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }, // blue tick
    verificationLevel: { type: Number, default: 0 }, // 0=none, 1=phone, 2=photo, 3=id

    // Rating
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },

    // Premium
    isPremium: { type: Boolean, default: false },
    premiumExpiry: { type: Date },

    // Status
    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
    isAdminFlagged: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },

    // Likes received
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Safety
    emergencyContact: { type: String },
    safeCheckInEnabled: { type: Boolean, default: false },

    // Admin
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);