const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const orderStatuses = ["Pending", "Making", "Shipped", "Delivered"];

function moneyTotal(items = []) {
  return items.reduce((sum, item) => {
    const qty = Number(item.qty || 1);
    return sum + Number(item.price || 0) * qty;
  }, 0);
}

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

async function findOrderProduct(item) {
  if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
    const product = await Product.findById(item.productId);
    if (product) return product;
  }

  return Product.findOne({ name: new RegExp(`^${escapeRegex(item.name)}$`, "i") });
}

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function reduceInventory(items) {
  for (const item of items) {
    const product = await findOrderProduct(item);

    if (!product) {
      continue;
    }

    const qty = Number(item.qty || 1);
    const stock = Number(product.stock || 0);

    if (stock < qty) {
      return {
        error: `${product.name} has only ${stock} left in stock`
      };
    }

    product.stock = stock - qty;
    await product.save();
  }

  return {};
}

function normalizeStatus(status) {
  if (status === "Confirmed") return "Making";
  return orderStatuses.includes(status) ? status : "Pending";
}

function timeFieldForStatus(status) {
  if (status === "Making") return "makingAt";
  if (status === "Shipped") return "shippedAt";
  if (status === "Delivered") return "deliveredAt";
  return "placedAt";
}

function orderResponse(order) {
  return {
    id: order.orderNumber || order._id,
    dbId: order._id,
    items: order.items,
    total: order.total,
    customer: order.customer,
    offer: order.offer,
    status: order.status,
    date: order.createdAt ? order.createdAt.toLocaleString() : "",
    placedAt: order.placedAt,
    makingAt: order.makingAt,
    shippedAt: order.shippedAt,
    deliveredAt: order.deliveredAt
  };
}

async function nextOrderNumber() {
  const count = await Order.countDocuments();
  return "SO-" + String(1001 + count);
}

async function createOrder(req, res) {
  const items = normalizeItems(req.body.items);

  if (items.length === 0) {
    return res.status(400).json({ message: "Order items are required" });
  }

  const inventory = await reduceInventory(items);

  if (inventory.error) {
    return res.status(400).json({ message: inventory.error });
  }

  const now = new Date().toLocaleString();
  const order = await Order.create({
    orderNumber: await nextOrderNumber(),
    user: req.user._id,
    items,
    total: Number(req.body.total || moneyTotal(items)),
    customer: req.body.customer || {},
    offer: req.body.offer || "No offer",
    status: "Pending",
    placedAt: now
  });

  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { user: req.user._id, items: [] },
    { upsert: true }
  );

  res.status(201).json({ order: orderResponse(order) });
}

async function getOrders(req, res) {
  const query = req.user.role === "admin" ? {} : { user: req.user._id };
  const orders = await Order.find(query).sort({ createdAt: -1 });
  res.json({ orders: orders.map(orderResponse) });
}

async function updateOrderStatus(req, res) {
  const order = await Order.findById(req.params.id) || await Order.findOne({ orderNumber: req.params.id });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const nextStatus = normalizeStatus(req.body.status);
  const now = new Date().toLocaleString();
  order.status = nextStatus;
  order[timeFieldForStatus(nextStatus)] = order[timeFieldForStatus(nextStatus)] || now;
  await order.save();

  res.json({ order: orderResponse(order) });
}

async function deleteOrder(req, res) {
  const order = await Order.findById(req.params.id) || await Order.findOne({ orderNumber: req.params.id });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (req.user.role !== "admin" && String(order.user) !== String(req.user._id)) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await order.deleteOne();
  res.json({ ok: true });
}

module.exports = { createOrder, deleteOrder, getOrders, updateOrderStatus };
