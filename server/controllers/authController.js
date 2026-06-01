const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    username: user.email,
    email: user.email,
    role: user.role
  };
}

function signToken(user) {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "smartornamentssecret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function normalizeCredentials(body) {
  const email = String(body.email || body.username || "").trim().toLowerCase();
  const name = String(body.name || email.split("@")[0] || "Customer").trim();
  const password = String(body.password || "");

  return { name, email, password };
}

async function register(req, res) {
  const { name, email, password } = normalizeCredentials(req.body);

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  if (password.length < 4) {
    return res.status(400).json({ message: "Password must be at least 4 characters" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user: publicUser(user)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function login(req, res) {
  const { email, password } = normalizeCredentials(req.body);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    res.json({
      token,
      user: publicUser(user)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}

async function logout(req, res) {
  res.json({ ok: true });
}

module.exports = { login, logout, me, register };
