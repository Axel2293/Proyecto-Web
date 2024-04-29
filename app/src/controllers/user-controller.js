const User = require("../models/User")

async function getUserInfo(req, res) {
  const email = req.email;

  // Search for user un DB
  const user = await User.findByEmail(email);
  if (user) {
    console.log(user);
    res.send({
      name: user.name,
      accountType: user.accountType,
      email: user.email
    });
    return;
  }else{
    res.status(404).send({
      error: "User not found"
    });
    return;
  }
}

module.exports = {getUserInfo}