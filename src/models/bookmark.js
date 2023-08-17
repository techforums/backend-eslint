const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "question",
        required: true,
    },

});

module.exports = mongoose.model("bookmark", bookmarkSchema);
