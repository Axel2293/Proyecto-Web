const router = require("express").Router();
const auth = require("../controllers/auth-controller.js");

/* 
    Auth enpoint
        -Login
        -Register
*/

router.post('/login', auth.loginUser);

router.post('/register', auth.registerUser);

module.exports = router;