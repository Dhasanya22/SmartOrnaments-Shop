const User = require("../models/User");

async function getUsers(req, res) {
  const users = await User.find().sort({ createdAt: -1 });

  res.json({
    users: users.map(user => ({
      id: user._id,
      name: user.name,
      username: user.email,
      email: user.email,
      role: user.role
    }))
  });
}

module.exports = { getUsers };
