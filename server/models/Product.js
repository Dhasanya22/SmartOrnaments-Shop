const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    images: {
      type: [String],
      default: []
    },
    type: {
      type: String,
      default: "keychain"
    },
    category: {
      type: String,
      trim: true,
      default: "Keychains"
    },
    description: {
      type: String,
      default: ""
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    featured: {
      type: Boolean,
      default: false
    },
    occasions: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
