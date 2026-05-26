/**
 * make-admin.js
 * Run this ONCE to promote a user to admin by email or phone.
 *
 * Usage:
 *   node scripts/make-admin.js your@email.com
 *   node scripts/make-admin.js 9999999999
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");

const identifier = process.argv[2];

if (!identifier) {
  console.error("❌ Please provide email or phone: node scripts/make-admin.js your@email.com");
  process.exit(1);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const query = identifier.includes("@") ? { email: identifier } : { phone: identifier };
  const user = await User.findOneAndUpdate(query, { role: "admin" }, { new: true });

  if (!user) {
    console.error(`❌ No user found with: ${identifier}`);
  } else {
    console.log(`✅ ${user.name} (${user.email || user.phone}) is now an ADMIN`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
