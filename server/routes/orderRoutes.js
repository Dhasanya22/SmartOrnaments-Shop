const express = require("express");
const { createOrder, deleteOrder, getOrders, updateOrderStatus } = require("../controllers/orderController");
const { adminOnly, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getOrders);
router.post("/", createOrder);
router.patch("/:id", adminOnly, updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;
