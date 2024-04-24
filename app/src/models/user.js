const mongoose = require('../db/connection');

// User schema
let userSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    passHash:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true
    }
});

// Operations on the Users endpoint
userSchema.statics.saveUser = async (data)=>{
    try {
        const usr = new User(data); 
        return await usr.save();
    } catch (error) {
        return null;   
    }
};

// Get all teachers info
userSchema.static.findTeachers = async ()=>{
    const teachers = User.find(
        {accountType:"teacher"}
    )

    return teachers;
};

userSchema.statics.updateUser = async (data)=>{
    const email = data.email;
    const updt = await User.where("email")
                        .equals(email)
}

//Internal that searches the user
userSchema.statics.findUsrByEmail =  async (email) => {
    let user = await User.find({
        email: {$eq:email}
    })

    return user;
};

module.exports = mongoose.model('Users', userSchema);


