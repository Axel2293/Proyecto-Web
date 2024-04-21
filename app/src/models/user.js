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
    accountType: {
        type: String,
        required: true
    }
});

// Operations on the Users endpoint
userSchema.statics.findUsrById =  async (_id) => {
    let data = await User.find({
        _id: {$eq:_id}
    })
}

module.exports = mongoose.model('User', userSchema);


