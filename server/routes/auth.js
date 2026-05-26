const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, age, gender, intents, interests, bio, location, mood } = req.body;

    // Input validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    if (!email && !phone) return res.status(400).json({ message: "Email or phone required" });
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (age && (age < 18 || age > 100)) {
      return res.status(400).json({ message: "Age must be between 18 and 100" });
    }

    const query = [];
    if (email) query.push({ email: email.toLowerCase() });
    if (phone) query.push({ phone });
    const existing = await User.findOne({ $or: query });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 12);
    const user = new User({
      name: name.trim(),
      email: email ? email.toLowerCase() : undefined,
      phone,
      age,
      gender,
      intents,
      interests,
      bio: bio ? bio.substring(0, 500) : undefined,
      location: { city: location },
      mood,
      password: hashed,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    const { password: _, ...userWithoutPass } = user.toObject();
    res.status(201).json({ user: userWithoutPass, token });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    if (!password) return res.status(400).json({ message: "Password is required" });
    if (!email && !phone) return res.status(400).json({ message: "Email or phone required" });

    const query = email ? { email: email.toLowerCase() } : { phone };
    const user = await User.findOne(query);

    // Use constant-time check to prevent timing attacks
    if (!user) {
      await bcrypt.compare(password, "$2b$12$invalidhashfortimingprotection00000000000000000000000");
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.isBanned) return res.status(403).json({ message: "Account suspended" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    user.lastSeen = Date.now();
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    const { password: _, ...userWithoutPass } = user.toObject();
    res.json({ user: userWithoutPass, token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
});

// GET /api/auth/me
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Me error:", err.message);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// PUT /api/auth/update-profile
router.put("/update-profile", verifyToken, async (req, res) => {
  try {
    const updates = req.body;

    // Strip dangerous fields — never allow client to set these
    const forbidden = ["password", "role", "isAdmin", "isBanned", "isVerified", "verificationLevel", "isPremium", "premiumExpiry", "likedBy", "matches", "_id"];
    forbidden.forEach((f) => delete updates[f]);

    // Validate bio length
    if (updates.bio) updates.bio = updates.bio.substring(0, 500);
    if (updates.name) updates.name = updates.name.trim().substring(0, 100);

    if (updates.location && typeof updates.location === "string") {
      updates.location = { city: updates.location };
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(500).json({ message: "Update failed" });
  }
});

// POST /api/auth/admin-passkey
// Validates the secret passkey and elevates the logged-in user to admin role
router.post("/admin-passkey", verifyToken, async (req, res) => {
  try {
    const { passkey } = req.body;
    const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY;

    if (!ADMIN_PASSKEY) {
      return res.status(503).json({ message: "Admin access not configured on this server." });
    }
    if (!passkey || passkey !== ADMIN_PASSKEY) {
      return res.status(401).json({ message: "Invalid passkey. Access denied." });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { role: "admin" },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Issue a fresh token with admin role embedded
    const token = jwt.sign({ id: user._id, role: "admin" }, JWT_SECRET, { expiresIn: "30d" });

    res.json({ user, token, message: "Admin access granted ✓" });
  } catch (err) {
    console.error("Admin passkey error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
module.exports.verifyToken = verifyToken;