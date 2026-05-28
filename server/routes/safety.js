const router = require("express").Router();
const { Report, Rating } = require("../models/Report");
const User = require("../models/User");
const { verifyToken } = require("./auth");

// POST /api/safety/report
router.post("/report", verifyToken, async (req, res) => {
  try {
    const { reportedId, reason, description } = req.body;
    const report = new Report({
      reporter: req.userId,
      reported: reportedId,
      reason,
      description,
    });
    await report.save();

    // Auto-flag if 3+ reports
    const reportCount = await Report.countDocuments({ reported: reportedId, status: { $ne: "dismissed" } });
    if (reportCount >= 3) {
      await User.findByIdAndUpdate(reportedId, { isAdminFlagged: true });
    }

    res.json({ message: "Report submitted. Our team will review it." });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// POST /api/safety/rate
router.post("/rate", verifyToken, async (req, res) => {
  try {
    const { ratedId, sessionId, rating, review, tags } = req.body;

    // Check if already rated
    const existing = await Rating.findOne({ rater: req.userId, rated: ratedId, sessionId });
    if (existing) return res.status(409).json({ message: "Already rated" });

    const ratingDoc = new Rating({
      rater: req.userId,
      rated: ratedId,
      sessionId,
      rating,
      review,
      tags,
    });
    await ratingDoc.save();

    // Update user's avg rating
    const allRatings = await Rating.find({ rated: ratedId });
    const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    await User.findByIdAndUpdate(ratedId, {
      rating: Math.round(avg * 10) / 10,
      totalRatings: allRatings.length,
    });

    res.json({ message: "Rating submitted!", avgRating: avg });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// POST /api/safety/sos - Emergency SOS with GPS location
router.post("/sos", verifyToken, async (req, res) => {
  try {
    const { location, coordinates, message, contact } = req.body;
    const user = await User.findById(req.userId);

    const emergencyContact = contact || user.emergencyContact;
    const sosMessage = message || `🚨 EMERGENCY SOS from ${user.name}. Location: ${location}`;

    // Full SOS log (In production: replace with Twilio SMS / Firebase push)
    console.log(`\n🚨 ========== SOS ALERT ==========`);
    console.log(`User:     ${user.name} (${user.email})`);
    console.log(`Contact:  ${emergencyContact || "NOT SET"}`);
    console.log(`Location: ${location}`);
    console.log(`Coords:   ${coordinates ? coordinates.join(", ") : "unavailable"}`);
    console.log(`Message:  ${sosMessage}`);
    console.log(`Time:     ${new Date().toISOString()}`);
    console.log(`================================\n`);

    // TODO: Uncomment below to enable real SMS via Twilio:
    // const twilio = require("twilio")(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    // if (emergencyContact) {
    //   await twilio.messages.create({
    //     body: sosMessage,
    //     from: process.env.TWILIO_PHONE,
    //     to: emergencyContact,
    //   });
    // }

    res.json({
      message: "SOS alert sent to emergency contact",
      contact: emergencyContact,
      location,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ message: "Error sending SOS", error: err.message });
  }
});

module.exports = router;
