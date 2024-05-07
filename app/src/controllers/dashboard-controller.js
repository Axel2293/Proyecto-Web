const { User } = require("../models/Subject");

async function getDashboard(req, res) {
  try {
    res.status(200).json({ message: "Dashboard" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { getDashboard };
