const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL || "smartornaments.shop@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = process.env.ADMIN_NAME || "SmartOrnaments Admin";

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    if (existingAdmin.role !== "admin") {
      existingAdmin.role = "admin";
      await existingAdmin.save();
    }
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin"
  });
}

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri === "your_mongodb_url") {
    console.warn("MongoDB not connected. Add your MongoDB Atlas URL to server/.env as MONGO_URI.");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
    await ensureAdminUser();
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
}

module.exports = connectDB;
