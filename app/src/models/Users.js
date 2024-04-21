const mongoose = require('mongoose');
const User = require('./user');
w
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
    role: {
        type: String,
        required: true
    }
});

// Operations on the Users endpoint
userSchema.statics.findUsrById =  async (id) => {
    let data = await User.find()
}

module.exports = mongoose.model('User', userSchema);


