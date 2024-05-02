const express = require("express");
const app = express();
const router = express.Router();

const auth = require("../middlewares/auth");
const SessionsController = require("../controllers/sessions-controller");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router.get("/", auth.authenticateToken, (req, res) => {
  console.log("Getting sessions");
  sessions = SessionsController.getSessions(req, res);
});

router.get("/{id}", auth.authenticateToken, (req, res) => {
  SessionsController.getSession(req, res);
});

router.post("/", auth.authenticateToken, (req, res) => {
  SessionsController.createSession(req, res);
});

router.put("/{id}", auth.authenticateToken, (req, res) => {
  SessionsController.updateSession(req, res);
});

router.delete("/{id}", auth.authenticateToken, (req, res) => {
  SessionsController.deleteSession(req, res);
});

module.exports = router;
