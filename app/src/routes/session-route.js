const express = require("express");
const app = express();
const router = express.Router();
const auth = require("../middleware/tokens");

const SessionsController = require("../controllers/sessions-controller");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router.get("/", (req, res) => {
  console.log("Getting sessions");
  SessionsController.getSessions(req, res);
});

router.get("/:id", (req, res) => {
  console.log("Getting session by id");
  SessionsController.getSessionById(req, res);
});

router.post("/", (req, res) => {
    console.log("Creating session");
    SessionsController.createSession(req, res);
});

router.put("/:id", (req, res) => {
  console.log("Updating session");
  SessionsController.updateSession(req, res);
});

router.put(
  "/enroll/:id",
  SessionsController.enrollStudent
);

router.delete(
  "/unenroll/:id",
  SessionsController.unenrollStudent
);

module.exports = router;
