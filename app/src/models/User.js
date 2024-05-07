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
    },
    pref_subjects:{
        type: [String],
        required: false
    },
    alerts:{
        type: [String],
        required:false
    }

});

// Operations on the Users endpoint

// Get teachers info (name and email)
userSchema.statics.findTeachers = async function (page = 1, pagesize = 6){
    const teachers = this.find(
        {accountType:{$in:["teacher", "both"]}},
        {name: 1,
        email: 1}
    )
    .skip((page-1) * pagesize)
    .limit(pagesize);
    return teachers;
};

//Internal that searches the user
userSchema.statics.findByEmail =  async function(email) {
    const user = await this.findOne({
        email: {$eq:email}
    })
    return user;
};

userSchema.statics.findById =  async function(id) {
    const user = await this.findOne({
        _id: {$eq:id}
    })
    return user;
};


module.exports = mongoose.model('User', userSchema);


