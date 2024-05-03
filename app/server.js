const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
require("dotenv").config();

// const port = 3151;
const port = process.env.PORT || 3151;

const tokent_md = require("./src/middleware/tokens"); 

const usersRoute = require("./src/routes/userRoutes");
const authRoute = require("./src/routes/authRoutes");


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // O restringe a tu origen específico
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
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

//Subjects routes
app.use("/subjects", express.json(), require("./src/routes/subject-route"));

//Users routes
app.use("/users", express.json(), tokent_md.verifyAuthToken, usersRoute);

// Auth routes
app.use("/auth", express.json(), authRoute);


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
