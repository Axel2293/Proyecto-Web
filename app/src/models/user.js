const {mongoose} = require('../db/connection');

// User schema
const userSchema = new mongoose.Schema({
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

// Get all teachers info
userSchema.static.findTeachers = async ()=>{
    const teachers = this.find(
        {accountType:"teacher"}
    )

    return teachers;
};

userSchema.statics.updateUser = async (data)=>{
    const email = data.email;
    const updt = await this.where("email")
                        .equals(email)
}

//Internal that searches the user
userSchema.statics.findUsrByEmail =  async function(email) {
    const user = await this.findOne({
        email: {$eq:email}
    })

    return user;
};


module.exports = mongoose.model('User', userSchema);


