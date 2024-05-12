const { mongoose } = require("../db/connection");

const alertSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

// Static methods

module.exports = mongoose.model("Alert", alertSchema);
