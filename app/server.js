const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");

const port = 3151;

const User = require("./src/models/user");
const UserController = require("./src/controllers/user-controller");

const register_route = require("./src/routes/register");

app.use(
  express.static(path.join(__dirname, "public/views"), {
    index: "home.html",
    extensions: ["html"],
  })
);

app.use(express.static(path.join(__dirname, "public"), { index: false }));

app.get("/", (req, res) => {});

app.use("/register", register_route);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
