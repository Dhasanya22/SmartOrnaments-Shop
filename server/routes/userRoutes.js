const express = require("express");
const { getUsers } = require("../controllers/userController");
const { adminOnly, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getUsers);

module.exports = router;
