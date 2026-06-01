const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

async function getStats(req, res) {
  const [orders, productsCount, usersCount] = await Promise.all([
    Order.find(),
    Product.countDocuments(),
    User.countDocuments()
  ]);
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const totals = new Map();

  orders.forEach(order => {
    (order.items || []).forEach(item => {
      const name = String(item.name || "").trim();
      if (!name) return;

      const key = name.toLowerCase();
      const current = totals.get(key) || { name, quantity: 0 };
      current.quantity += Number(item.qty || 1);
      totals.set(key, current);
    });
  });

  const bestSeller = Array.from(totals.values()).sort((a, b) => b.quantity - a.quantity)[0] || null;

  res.json({
    bestSeller,
    totalOrders: orders.length,
    revenue,
    productsCount,
    usersCount
  });
}

module.exports = { getStats };
