const mongoose = require("mongoose");

const userRoleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    default: "developer",
    trim: true,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("userrole", userRoleSchema);
