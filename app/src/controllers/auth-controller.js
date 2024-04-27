const User = require("../models/User");
const mongoose = require("../db/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function loginUser(req, res) {
    const {email, password} = req.body;

    if(password && email && password!='' && email!=''){
        let userData = User.findUsrByEmail(email);
        if (userData) {
            let hashCode = bcrypt.hashSync(password, 10);
            if (bcrypt.compareSync(userData["passHash"], hashCode) && email==userData["email"]) {
                //Create JWT token (valid for 1 hour)
                const auth = jwt.sign(userData.email, process.env.JWT_SECRET,{
                    algorithm:"ES256",
                    expiresIn:
                })
            }else{
                res.status(401).send({
                    authError: "Password or email are not correct."
                })
            }
        }else{
            res.status(404).send({
                authError: "Account with given email not found."
            })
        }
    }
    else{
        res.status(404).send({
            error:"No email or password was given"
        })
        return;
    }
}

function registerUser(req, res) {
    const {email, password, name} = req.body;

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

    // Create user from Model
    const usr = new User({
        email: email,
        passHash: bcrypt.hashSync(password),
        name: name,
        accountType: 'student'
    });
    
    console.log("Registered user "+usr);
    try {
        usr.save();
        res.status(201).send({
            msg:"User created correctly"
        });
    } catch (error) {
        res.status(500).send({
            error:"Something bad happened :( User not created"
        });
    };
}

module.exports = {loginUser, registerUser};