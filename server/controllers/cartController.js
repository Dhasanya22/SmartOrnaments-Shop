const Cart = require("../models/Cart");
const mongoose = require("mongoose");

function normalizeItems(items = []) {
  return (Array.isArray(items) ? items : [])
    .map(item => {
      const rawProductId = item.productId || item.id;
      const productId = mongoose.Types.ObjectId.isValid(rawProductId) ? rawProductId : undefined;

      return {
        productId,
        name: String(item.name || "").trim(),
        price: Number(item.price || 0),
        qty: Math.max(Number(item.qty || 1), 1),
        image: String(item.image || "").trim(),
        category: String(item.category || "").trim(),
        customization: item.customization || {}
      };
    })
    .filter(item => item.name && item.price > 0);
}

async function getCart(req, res) {
  const cart = await Cart.findOne({ user: req.user._id });
  res.json({ cart: cart || { user: req.user._id, items: [] } });
}

async function saveCart(req, res) {
  const items = normalizeItems(req.body.items);
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { user: req.user._id, items },
    { new: true, upsert: true }
  );

  res.json({ cart });
}

async function addCartItem(req, res) {
  const [item] = normalizeItems([req.body]);

  if (!item) {
    return res.status(400).json({ message: "Valid cart item is required" });
  }

  const cart = await Cart.findOne({ user: req.user._id }) || new Cart({ user: req.user._id, items: [] });
  const existing = cart.items.find(cartItem =>
    String(cartItem.productId || "") === String(item.productId || "")
    && cartItem.name === item.name
    && Number(cartItem.price) === Number(item.price)
    && JSON.stringify(cartItem.customization || {}) === JSON.stringify(item.customization || {})
  );

  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.items.push(item);
  }

  await cart.save();
  res.status(201).json({ cart });
}

async function clearCart(req, res) {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { user: req.user._id, items: [] },
    { new: true, upsert: true }
  );

  res.json({ cart });
}

module.exports = { addCartItem, clearCart, getCart, saveCart };
