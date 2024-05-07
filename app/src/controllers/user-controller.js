const User = require("../models/User")
const bcrypt = require("bcryptjs");

async function getUserInfo(req, res) {
  const id = req.id;
  const {teachers, page, pagesize} = req.query;
  console.log(req.query);

  if (teachers && teachers == 1) {
    const teachersData = await User.findTeachers(page, pagesize);
    res.send(
      teachersData
    )
    return;
    
  }else{
      // Search for user un DB
    const user = await User.findById(id)
    if (user) {
      console.log(user);
      //Send all user data
      res.send({
        name: user.name,
        accountType: user.accountType,
        email: user.email,
        pref_subjects: user.pref_subjects,
        alerts: user.alerts
      });
      return;
    }else{
      res.status(404).send({
        error: "User not found"
      });
      return;
    }
  }
}

async function updateUser(req, res){
  const data = req.body;
  const id = req.id;
  const query = {};

  if ("name" in data) {
    query.name = data["name"];
  }
  if ("email" in data) {
    try {
      query.email = data["email"]
    } catch (error) {
      res.status(400).send({
        error: "Could not update email "+error
      })
    }
  }
  if ("password" in data) {
    query.passHash = bcrypt.hashSync(data["password"], 10)
  }

  if ("pref_subjects" in data) {
    query.pref_subjects = {"$push":data["pref_subjects"]};
  }
  //Save user
  try {
    await User.updateOne(
      {_id:id},
      query
    )
    res.status(200).send({
        msg:"User updated correctly"
    });
    return;
  } catch (error) {
      res.status(500).send({
          error:"User not updated "+error
      });
      return;
  };

  
}

module.exports = {getUserInfo, updateUser}