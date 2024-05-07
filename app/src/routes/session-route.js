const express = require("express");
const app = express();
const router = express.Router();
const auth = require("../middleware/tokens");

const SessionsController = require("../controllers/sessions-controller");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router.put("/enroll/:id", auth.verifyAuthToken, SessionsController.enrollStudent);

router.delete("/unenroll/:id", auth.verifyAuthToken, SessionsController.unenrollStudent);

module.exports = router;
