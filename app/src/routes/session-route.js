const express = require("express");
const app = express();
const router = express.Router();

const SessionsController = require("../controllers/sessions-controller");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router.get("/", (req, res) => {
  console.log("Getting sessions");
  console.log("Oa debugando");
  SessionsController.getSessions(req, res);
});

router.get("/:uuid", (req, res) => {
  console.log("Getting session by uuid");
  SessionsController.getSession(req, res);
});

router.post("/", (req, res) => {
  console.log("Creating session");
  SessionsController.createSession(req, res);
});

router.put("/:uuid", (req, res) => {
  console.log("Updating session");
  SessionsController.updateSession(req, res);
});

router.delete("/:uuid", (req, res) => {
  console.log("Deleting session");
  SessionsController.deleteSession(req, res);
});

module.exports = router;