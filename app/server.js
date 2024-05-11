const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
require("dotenv").config();

// const port = 3151;
const port = process.env.PORT || 3151;

const tokent_md = require("./src/middleware/tokens");

const usersRoute = require("./src/routes/userRoutes");
const sessionsRoute = require("./src/routes/session-route");
const authRoute = require("./src/routes/authRoutes");


const Utils = require("./src/utils/utils");
const AlertController = require("./src/controllers/alert-controller");
const UserContoller = require("./src/controllers/user-controller");

app.use(express.json());

//CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // O restringe a tu origen específico
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth, Access-Control-Allow-Origin, Access-Control-Allow-Headers"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    return res.status(200).json({});
  }
  next();
});

// Public routes
app.use(
  express.static(path.join(__dirname, "public/views"), {
    index: "home.html",
    extensions: ["html"],
  })
);

app.use(express.static(path.join(__dirname, "public"), { index: false }));

app.get("/", (req, res) => {
  let login_redirect = document.getElementById("login-btn-redirect");
  login_redirect.addEventListener("click", () => {
    res.redirect("/login");
  });
});

app.get("/test/alerts", (req, res) => {
  AlertController.getAlerts(req, res);
});

//Users routes
app.use("/users", tokent_md.verifyAuthToken, usersRoute);

// Auth routes
app.use("/auth", authRoute);

app.use("/sessions", tokent_md.verifyAuthToken, sessionsRoute);

//app.use("/sessions/:uuid", tokent_md.verifyAuthToken, sessionsRoute);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
