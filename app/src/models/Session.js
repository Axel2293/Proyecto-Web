const { mongoose } = require("../db/connection");

const sessionSchema = new mongoose.Schema({
  teacher_uuid: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  student_uuid: {
    type: mongoose.SchemaTypes.ObjectId,
    required: false,
  },
  subject_uuid: {
    type: mongoose.SchemaTypes.ObjectId,
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
  status: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
  updated_at: {
    type: Date,
  },
  updated_session: {
    type: mongoose.SchemaTypes.ObjectId,
  },
});

// Static methods

// Instance methods

module.exports = mongoose.model("Session", sessionSchema);
