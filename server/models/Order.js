const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, default: 1, min: 1 },
    image: { type: String, default: "" },
    category: { type: String, default: "" },
    customization: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    offer: {
      type: String,
      default: "No offer"
    },
    status: {
      type: String,
      enum: ["Pending", "Making", "Shipped", "Delivered"],
      default: "Pending"
    },
    placedAt: String,
    makingAt: String,
    shippedAt: String,
    deliveredAt: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
