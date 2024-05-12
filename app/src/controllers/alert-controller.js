const User = require("../models/User");
const Alert = require("../models/Alert");

async function createAlert(data) {
  const id = data.user_id;
  const role = data.role;
  const message = data.message;
  const status = data.status;

  const alert = new Alert({
    user_id: id,
    role: role,
    message: message,
    status: status,
  });

  const user = await User.findById(id);
  user.alerts.push(alert);
  await user.save();
}

async function updateAlertStatus(req, res) {
  const alert_id = req.params.id;
  const id = req.id;

  const user = await User.findById(id);
  const alert = user.alerts.id(alert_id);
  alert.status = "seen";
  await user.save();
  res.status(200).send("Alert updated");
}

module.exports = {
  createAlert,
  updateAlertStatus,
};
