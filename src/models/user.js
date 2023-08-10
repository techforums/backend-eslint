const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
  },

  firstName: {
    type: String,
    required: true,
    trim: true,
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
  },

  userRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userRole",
    required: true,
  },
});
module.exports = mongoose.model("user", userSchema);
