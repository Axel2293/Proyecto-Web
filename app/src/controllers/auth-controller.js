const User = require("../models/User");
const mongoose = require("../db/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function loginUser(req, res) {
    const {email, password} = req.body;

    if(password && email && password!='' && email!=''){
        const userData = await User.findUsrByEmail(email);
        console.log("Login attempt for ", userData)
        if (userData){
            if (bcrypt.compareSync(password, userData["passHash"]) && email==userData["email"]) {
                //Create JWT token (valid for 1 hour)
                const sToken = jwt.sign({email:userData.email}, process.env.JWT_SECRET,{
                    expiresIn: 3600
                })
                res.send({sToken})
            }else{
                res.status(401).send({
                    authError: "Password or email are not correct."
                })
                return;
                
            }
        }else{
            res.status(404).send({
                authError: "Account with given email not found."
            })
            return;
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

    try {
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
                error:"Something bad happened :( User not created"+error
            });
        };
    } catch (error) {
        res.status(500).send({
            error:"Bad new account information"
        });
        return;
    }
}

module.exports = {loginUser, registerUser};