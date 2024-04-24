const router = require("express").Router();
const mongoose = require("../db/connection");
const bcrypt = require("bcryptjs");
const User = require('./User');
const { error } = require("console");

/* 
    Auth enpoint
        -Login
        -Register
*/

router.post('/login', (req, res)=>{
    const {email, password} = req.body;
    if(password && email && password!='' && email!=''){
        let hashCode = bcrypt.hashSync(password, 10);
        let userData = User.findUsrByEmail(email);
        if (userData) {
            
        }
    }else{
        res.status(404).send({
            error:"No email or password was given"
        })
        return;
    }

});

router.post('/register', (req, res)=>{
    const {name, email, password} = req.body;

    if (!name || name=="") {
        res.status(400).send({
            error:"No name field or its empty"
        });
        return;
    }

    if(!email || email==""){
        res.status(400).send({
            error:"No email field or its empty"
        });
        return;
    }

    if(!password || password==""){
        res.status(400).send({
            error:"No password field or its empty"
        });
        return;
    }

    //Add user to DB
    let usr 
});

module.exports = router;