const router = require("express").Router()
const userController = require("../controllers/user-controller")

// Get info of the users
router.get('/', userController.getUserInfo);

// Modify user data
router.put('/', ()=>{
    const {name, email, password} = req.body;
    
});

module.exports = router;