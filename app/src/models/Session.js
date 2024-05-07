const { mongoose } = require("../db/connection");

const sessionSchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  students: {
    type: [mongoose.SchemaTypes.ObjectId],
    required: true,
  },
  students_limit:{
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  messages: {
    type: [
      {
        sender: {
          type: mongoose.SchemaTypes.ObjectId,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          required: true,
        },
      },
    ],
    required: false,
  },
});

// Static methods

module.exports = mongoose.model("Session", sessionSchema);
