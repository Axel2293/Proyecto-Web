const express = require("express");
const app = express();
const router = express.Router();
const auth = require("../middleware/tokens");

const SessionsController = require("../controllers/sessions-controller");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router.get("/", auth.verifyAuthToken, (req, res) => {
  SessionsController.getSessions(req, res);
});

router.get("/:uuid", auth.verifyAuthToken, (req, res) => {
  SessionsController.getSession(req, res);
});

router.get("/teacher/:uuid", auth.verifyAuthToken, (req, res) => {
  SessionsController.getTeacherSessions(req, res);
});

router.get("/student/:uuid", auth.verifyAuthToken, (req, res) => {
  // verify type of SessionsController.getStudentSessions(req, res);
  typeof SessionsController.getStudentSessions(req, res);
});

//router.get("/subject/:uuid", (req, res) => {
//  SessionsController.getSubjectSessions(req, res);
//});
//
//router.get("/status/:status", (req, res) => {
//  SessionsController.getStatusSessions(req, res);
//});

router.post("/", auth.verifyAuthToken, (req, res) => {
  SessionsController.createSession(req, res);
});

router.put("/:uuid", auth.verifyAuthToken, (req, res) => {
  SessionsController.updateSession(req, res);
});

router.delete("/:uuid", auth.verifyAuthToken, (req, res) => {
  SessionsController.deleteSession(req, res);
});

module.exports = router;
