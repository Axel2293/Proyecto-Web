const mongoose = require('mongoose');

let sessionSchema = new mongoose.Schema({
    isAvailable: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    student: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    },
    subject: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('Session', sessionSchema);