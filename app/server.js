const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
require("dotenv").config();

// const port = 3151;
const port = process.env.PORT || 3151;

const User = require("./src/models/User");
const UserController = require("./src/controllers/user-controller");

const authRoute = require("./src/routes/auth");

//Parsing body as json middleware
app.use(express.json());

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

// Auth routes
app.use("/auth", authRoute);


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
