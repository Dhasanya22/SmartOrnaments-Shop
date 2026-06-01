const express = require("express");
const multer = require("multer");
const {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  uploadProductImage
} = require("../controllers/productController");
const { adminOnly, protect } = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/upload", protect, adminOnly, upload.single("image"), uploadProductImage);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
