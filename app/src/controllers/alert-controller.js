const mongoose = require("mongoose");
const User = require("../models/User");
const Alert = require("../models/Alert");

// Create an alert from
//AlertController.createAlert({
//  user_id: session.teacher_id,
//  role: "teacher",
//  message: `Student ${student.name} enrolled in your session ${session.subject}`,
//  status: "unseen",
//});

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

async function getAlert(req, res) {
  const { id } = req.params;
  const alert = await Alert.findById(id);
  res.status(200).json(alert);
}

async function getAlertsByRole(req, res) {
  console.log("req.params: ", req.params);
  const { user_id, role } = req.params;
  console.log("user_id: ", user_id, "role: ", role);
  const status = req.query.status || "unseen";
  const alerts = await Alert.find({ user_id, role, status });
  res.status(200).json(alerts);
}

async function updateAlertStatus(req, res) {
  const { id } = req.params;
  const alert = await Alert.findByIdAndUpdate(
    id,
    { status: "seen" },
    { new: true }
  );
}

// Get all alerts
async function getAlerts(req, res) {
  const alerts = await Alert.find();
  res.status(200).json(alerts);
}

module.exports = {
  createAlert,
  getAlerts,
  getAlert,
  getAlertsByRole,
  updateAlertStatus,
};
