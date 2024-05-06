const express = require("express");
const app = express();
const router = express.Router();
const auth = require("../middleware/tokens");

const DashboardController = require("../controllers/dashboard-controller");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router.get("/", auth.verifyAuthToken, (req, res) => {
  DashboardController.getDashboard(req, res);
});

router.get("/student/:uuid", (req, res) => {
  res.send("Student dashboard");
});

module.exports = router;
