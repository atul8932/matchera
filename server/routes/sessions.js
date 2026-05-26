const router = require("express").Router();
const Session = require("../models/Session");
const { verifyToken } = require("./auth");

// GET /api/sessions - All public sessions with filters
router.get("/", verifyToken, async (req, res) => {
  try {
    const { type, city, budget, status } = req.query;
    const filter = { isPublic: true, status: status || "open" };
    if (type) filter.type = type;
    if (budget) filter.budget = budget;
    if (city) {
      const escapedCity = city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").substring(0, 100);
      filter["location.city"] = new RegExp(escapedCity, "i");
    }

    const sessions = await Session.find(filter)
      .populate("createdBy", "name profilePhoto age isVerified rating")
      .populate("participants", "name profilePhoto")
      .sort("-createdAt")
      .limit(50);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// POST /api/sessions - Create session
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, type, city, venue, time, budget, maxParticipants, tags } = req.body;
    const session = new Session({
      title, description, type,
      location: { city, venue },
      time, budget,
      maxParticipants: maxParticipants || 1,
      tags,
      createdBy: req.userId,
    });
    await session.save();
    await session.populate("createdBy", "name profilePhoto age isVerified rating");
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: "Error creating session", error: err.message });
  }
});

// GET /api/sessions/my/created - My created sessions
// IMPORTANT: Must be before /:id to avoid Express matching "my" as an ObjectId
router.get("/my/created", verifyToken, async (req, res) => {
  try {
    const sessions = await Session.find({ createdBy: req.userId })
      .populate("participants", "name profilePhoto")
      .sort("-createdAt");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// GET /api/sessions/:id
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("createdBy", "name profilePhoto age isVerified rating bio")
      .populate("participants", "name profilePhoto age")
      .populate("requests.user", "name profilePhoto age");
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// POST /api/sessions/:id/join - Request to join
router.post("/:id/join", verifyToken, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Not found" });
    if (session.status !== "open") return res.status(400).json({ message: "Session is closed" });

    const alreadyRequested = session.requests.find(
      (r) => r.user.toString() === req.userId
    );
    if (alreadyRequested) return res.status(409).json({ message: "Already requested" });

    if (session.participants.includes(req.userId)) {
      return res.status(409).json({ message: "Already joined" });
    }

    session.requests.push({ user: req.userId, message: req.body.message });
    await session.save();
    res.json({ message: "Join request sent!" });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// PUT /api/sessions/:id/request/:userId - Accept/reject request
router.put("/:id/request/:userId", verifyToken, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Not found" });
    if (session.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const reqObj = session.requests.find(
      (r) => r.user.toString() === req.params.userId
    );
    if (!reqObj) return res.status(404).json({ message: "Request not found" });

    reqObj.status = req.body.status; // accepted | rejected
    if (req.body.status === "accepted") {
      session.participants.push(req.params.userId);
      if (session.participants.length >= session.maxParticipants) {
        session.status = "closed";
      }
    }
    await session.save();
    res.json({ message: `Request ${req.body.status}` });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// DELETE /api/sessions/:id - Cancel session
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Not found" });
    if (session.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    session.status = "cancelled";
    await session.save();
    res.json({ message: "Session cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});


module.exports = router;