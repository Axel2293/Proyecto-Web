const router = require("express").Router();

let test_users = [
  {
    name: "Axelin",
    email: "axelin@iteso.mx",
    password: "12345678",
    role: "student",
  },
  {
    name: "Ramoncin",
    email: "ramoncin@iteso.mx",
    password: "12345678",
    role: "student",
  },
  {
    name: "Fits",
    email: "fitcito@iteso.mx",
    password: "12345678",
    role: "student",
  },
  {
    name: "Ramoncin",
    email: "ramoncin@iteso.mx",
    password: "12345678",
    role: "teacher",
  },
  {
    name: "Fitcito",
    email: "fitcito@iteso.mx",
    password: "12345678",
    role: "student",
  },
  {
    name: "Alexin",
    email: "alexin@iteso.mx",
    password: "12345678",
    role: "teacher",
  },
  {
    name: "Pelayin",
    email: "pelayin@iteso.mx",
    password: "12345678",
    role: "student",
  },
  {
    name: "Samuelin",
    email: "Samuelin@iteso.mx",
    password: "12345678",
    role: "student",
  },
  {
    name: "Angelin",
    email: "angelin@iteso.mx",
    password: "12345678",
    role: "teacher",
  },
  {
    name: "Santanin",
    email: "santanin@iteso.mx",
    password: "12345678",
    role: "teacher",
  },
  {
    name: "Santanin",
    email: "santanin@iteso.mx",
    password: "12345678",
    role: "student",
  },
];

router.get("/test", (req, res) => {
  res.send("Hello World");
});

router.get("/test/user", (req, res) => {
  let newUser = User.fromObject(test_users);
  res.json(newUser);
});

router.get("/test/user/controller", (req, res) => {
  //let newUser = UserController.createUser(test_users[10]);
  // PREGUNTA: Que es mejor, archivos distintos para cada rol o un solo archivo con todos los roles?
  let findUser = UserController.findUserByEmail(
    "fitcito@iteso.mx",
    "student",
    UserController.getUsers()
  );
  UserController.updateUser(findUser.id, test_users[4]);
  console.table(UserController.getUsers());
  //res.json(newUser);
});

module.exports = router;
