const mongoose = require("mongoose");

let subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teacher_id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

// Como saber el status... El teacher decide el status
module.exports = mongoose.model("Subject", subjectSchema);
