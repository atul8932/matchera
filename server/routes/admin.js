const router = require("express").Router();
const User = require("../models/User");
const { Report } = require("../models/Report");
const Session = require("../models/Session");
const Message = require("../models/Message");
const Match = require("../models/Match");
const { verifyToken } = require("./auth");

// Admin-only middleware
const adminOnly = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// GET /api/admin/stats
router.get("/stats", verifyToken, adminOnly, async (req, res) => {
  try {
    const [totalUsers, activeUsers, totalSessions, totalMatches, pendingReports, bannedUsers] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isActive: true, isBanned: false }),
        Session.countDocuments(),
        Match.countDocuments(),
        Report.countDocuments({ status: "pending" }),
        User.countDocuments({ isBanned: true }),
      ]);

    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });

    res.json({ totalUsers, activeUsers, totalSessions, totalMatches, pendingReports, bannedUsers, newUsersToday });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// GET /api/admin/users
router.get("/users", verifyToken, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const filter = {};
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").substring(0, 100);
      filter.$or = [{ name: new RegExp(escapedSearch, "i") }, { email: new RegExp(escapedSearch, "i") }];
    }
    if (status === "banned") filter.isBanned = true;
    if (status === "flagged") filter.isAdminFlagged = true;
    if (status === "verified") filter.isVerified = true;

    const users = await User.find(filter)
      .select("-password")
      .sort("-createdAt")
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(filter);
    res.json({ users, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// PUT /api/admin/users/:id/ban
router.put("/users/:id/ban", verifyToken, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: req.body.ban, isActive: !req.body.ban },
      { new: true }
    ).select("-password");
    res.json({ message: req.body.ban ? "User banned" : "User unbanned", user });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// PUT /api/admin/users/:id/verify
router.put("/users/:id/verify", verifyToken, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true, verificationLevel: 3 },
      { new: true }
    ).select("-password");
    res.json({ message: "User verified with blue tick", user });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// GET /api/admin/reports
router.get("/reports", verifyToken, adminOnly, async (req, res) => {
  try {
    const { status = "pending" } = req.query;
    const reports = await Report.find({ status })
      .populate("reporter", "name email")
      .populate("reported", "name email profilePhoto")
      .sort("-createdAt")
      .limit(50);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// PUT /api/admin/reports/:id
router.put("/reports/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, adminNote, reviewedBy: req.userId },
      { new: true }
    );
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// PUT /api/admin/users/:id/make-admin
router.put("/users/:id/make-admin", verifyToken, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: "admin" }, { new: true }).select("-password");
    res.json({ message: "User promoted to admin", user });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

module.exports = router;
