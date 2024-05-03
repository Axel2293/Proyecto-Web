const express = require("express");
const app = express();
const router = express.Router();

const auth = require("../middlewares/tokens");
const SessionsController = require("../controllers/sessions-controller");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router.get("/", auth.verifyAuthToken, (req, res) => {
  console.log("Getting sessions");
  SessionsController.getSessions(req, res);
});

router.get("/{id}", auth.verifyAuthToken, (req, res) => {
  console.log("Getting session");
  SessionsController.getSession(req, res);
});

router.post("/", auth.verifyAuthToken, (req, res) => {
  console.log("Creating session");
  SessionsController.createSession(req, res);
});

router.put("/{id}", auth.verifyAuthToken, (req, res) => {
  console.log("Updating session");
  SessionsController.updateSession(req, res);
});

router.delete("/{id}", auth.verifyAuthToken, (req, res) => {
  console.log("Deleting session");
  SessionsController.deleteSession(req, res);
});

module.exports = router;
