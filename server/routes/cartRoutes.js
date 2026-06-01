const express = require("express");
const { addCartItem, clearCart, getCart, saveCart } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getCart);
router.put("/", saveCart);
router.post("/items", addCartItem);
router.delete("/", clearCart);

module.exports = router;
