const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "question",
  },

  answer: {
    type: String,
    required: true,
  },

  upvotes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    unique: true,
  },

  downvotes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    unique: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("answer", answerSchema);
