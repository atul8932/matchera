const router = require("express").Router();
const User = require("../models/User");
const Match = require("../models/Match");
const { verifyToken } = require("./auth");

// GET /api/users - Explore/Discover (with filters)
router.get("/", verifyToken, async (req, res) => {
  try {
    const { intent, gender, minAge, maxAge, mood, city } = req.query;
    const filter = {
      _id: { $ne: req.userId },
      isActive: true,
      isBanned: false,
    };
    if (intent) filter.intents = intent;
    if (gender) filter.gender = gender;
    if (mood) filter.mood = mood;
    if (city) {
      // Escape special regex chars to prevent ReDoS
      const escapedCity = city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").substring(0, 100);
      filter["location.city"] = new RegExp(escapedCity, "i");
    }
    if (minAge || maxAge) {
      filter.age = {};
      const parsedMin = parseInt(minAge);
      const parsedMax = parseInt(maxAge);
      if (minAge && !isNaN(parsedMin)) filter.age.$gte = Math.max(18, parsedMin);
      if (maxAge && !isNaN(parsedMax)) filter.age.$lte = Math.min(100, parsedMax);
    }

    const users = await User.find(filter).select("-password -likedBy -matches").limit(50).sort("-createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// GET /api/users/me/matches - Get my matches
// IMPORTANT: Must be before /:id to avoid Express matching "me" as an ObjectId
router.get("/me/matches", verifyToken, async (req, res) => {
  try {
    const matches = await Match.find({ users: req.userId })
      .populate("users", "-password -likedBy")
      .sort("-updatedAt");
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// GET /api/users/me/likes - Who liked me (premium)
// IMPORTANT: Must be before /:id to avoid Express matching "me" as an ObjectId
router.get("/me/likes", verifyToken, async (req, res) => {
  try {
    const me = await User.findById(req.userId).populate("likedBy", "name profilePhoto age intents mood");
    if (!me.isPremium) {
      return res.json({ message: "Premium feature", count: me.likedBy.length });
    }
    res.json(me.likedBy);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// GET /api/users/:id - View profile
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -likedBy");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// POST /api/users/:id/like - Like a user
router.post("/:id/like", verifyToken, async (req, res) => {
  try {
    const targetId = req.params.id;
    const meId = req.userId;

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: "User not found" });

    // Check if already liked
    if (target.likedBy.includes(meId)) {
      return res.json({ message: "Already liked", isMatch: false });
    }

    // Add like
    target.likedBy.push(meId);
    await target.save();

    // Check mutual like (match!)
    const me = await User.findById(meId);
    const isMatch = me.likedBy.includes(targetId);

    if (isMatch) {
      // Calculate compatibility score always
      const sharedIntents = me.intents.filter((i) => target.intents.includes(i));
      const sharedInterests = me.interests.filter((i) => target.interests.includes(i));
      const score = Math.min(
        100,
        Math.round(
          50 +
            sharedIntents.length * 15 +
            sharedInterests.length * 5 +
            (me.mood === target.mood ? 10 : 0)
        )
      );

      // Create match only if it doesn't already exist
      const existingMatch = await Match.findOne({ users: { $all: [meId, targetId] } });
      if (!existingMatch) {
        await Match.create({
          users: [meId, targetId],
          compatibilityScore: score,
          sharedIntents,
          sharedInterests,
        });

        me.matches.push(targetId);
        target.matches.push(meId);
        await me.save();
        await target.save();
      }
      return res.json({ isMatch: true, compatibilityScore: existingMatch?.compatibilityScore ?? score, message: "It's a match!" });
    }

    res.json({ isMatch: false, message: "Liked!" });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// POST /api/users/:id/pass - Pass/dislike
router.post("/:id/pass", verifyToken, async (req, res) => {
  res.json({ message: "Passed" });
});



module.exports = router;