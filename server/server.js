const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const statsRoutes = require("./routes/statsRoutes");
const userRoutes = require("./routes/userRoutes");
const { login, register, logout } = require("./controllers/authController");
const dbReady = require("./middleware/dbReady");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

connectDB();

app.get("/", (req, res) => {
  res.send("API Running");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "SmartOrnaments API" });
});

app.use("/api/auth", dbReady, authRoutes);
app.use("/api/cart", dbReady, cartRoutes);
app.use("/api/orders", dbReady, orderRoutes);
app.use("/api/products", dbReady, productRoutes);
app.use("/api/stats", dbReady, statsRoutes);
app.use("/api/users", dbReady, userRoutes);

// Compatibility routes for the existing HTML frontend.
app.post("/api/signup", dbReady, register);
app.post("/api/login", dbReady, login);
app.post("/api/logout", logout);

app.use(express.static(path.join(__dirname, "..")));

app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
