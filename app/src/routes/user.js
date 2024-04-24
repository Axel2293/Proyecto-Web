const router = require("express").Router()
const User = require("../models/User");


// Get info of the users
router.get('/', ()=>{
    User
});

// Modify user data
router.put('/', ()=>{

});

module.exports = router;