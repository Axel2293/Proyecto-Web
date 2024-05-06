const { User } = require("../models/Subject");

async function getDashboard(req, res) {
  try {
    const { uuid } = req.params;
    const user = await User.findOne({
      where: {
        uuid,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { getDashboard };
