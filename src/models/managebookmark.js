const mongoose = require("mongoose");

const managebookmarkSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "bookmark",
    required: true,
  },
});

module.exports = mongoose.model("managebookmark", managebookmarkSchema);
