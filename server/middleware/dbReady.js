const mongoose = require("mongoose");

function dbReady(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database not connected. Add your MongoDB Atlas MONGO_URI in server/.env."
    });
  }

  next();
}

module.exports = dbReady;
