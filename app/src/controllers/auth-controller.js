const User = require("../models/User");
const mongoose = require("../db/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function loginUser(req, res) {
    const {email, password} = await req.body;
    console.log(req.body);

    if(password && email && password!='' && email!=''){
        const userData = await User.findByEmail(email);
        console.log("Login attempt for ", userData)
        if (userData){
            if (bcrypt.compareSync(password, userData["passHash"]) && email==userData["email"]) {
                //Create JWT token (valid for 1 hour)
                const sToken = jwt.sign({email:userData.email, id:userData._id, accountType:userData.accountType}, process.env.JWT_SECRET,{
                    expiresIn: 18000
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
        res.status(400).send({
            authError:"No email or password was given"
        })
        return;
    }
}

async function registerUser(req, res) {
    const {email, password, name, accountType} = req.body;

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

    const types = ["teacher", "student", "both"]
    if (!accountType || types.indexOf(accountType)==-1) {
        res.status(400).send({
            error:"Bad or no account type"
        });
        return;
    }

    try {
        // Create user from Model
        const usr = new User({
            email: email,
            passHash: bcrypt.hashSync(password),
            name: name,
            accountType: accountType
        });
        console.log("Registered user "+usr)

        try {
            await usr.save();
            res.status(201).send({
                msg:"User created correctly"
            });
            return;
        } catch (error) {
            res.status(500).send({
                error:"Something bad happened :(. User not created"+error
            });
            return;
        };
    } catch (error) {
        res.status(500).send({
            error:"Bad new account information"
        });
        return;
    };
}

module.exports = {loginUser, registerUser};