const express = require("express");

const answerRoutes = express.Router();
const answerController = require("./answer.controller");
const auth = require("../../middleware/auth");
const validator = require("../../middleware/validator");

answerRoutes.post("/answer", auth.auth, validator.anwerValidatePost(), validator.validate, answerController.addAnswer);
answerRoutes.get("/answer/:questionId", validator.answerValidateGetById(), validator.validate, answerController.getAnswerByquestionId);
answerRoutes.patch("/answer/:id", auth.auth, validator.answerValidatePatch(), validator.validate, answerController.editAnswer);
answerRoutes.delete("/answer/:id", auth.auth, answerController.deleteAnswer);
answerRoutes.post("/upvote/:id", auth.auth, answerController.Upvote);
answerRoutes.post("/downvote/:id", auth.auth, answerController.Downvote);
answerRoutes.get("/upvote/:id", auth.auth, answerController.checkup);
answerRoutes.get("/downvote/:id", auth.auth, answerController.checkdown);

module.exports = answerRoutes;
