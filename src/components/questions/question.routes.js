const express = require("express");

const questionRouter = new express.Router();
const questionController = require("./question.controller");
const auth = require("../../middleware/auth");
const validator = require("../../middleware/validator");

questionRouter.post("/question", validator.questionValidate(), validator.validate, auth.auth, questionController.createQuestion);

questionRouter.get("/question", questionController.readQuestions);

questionRouter.get("/quepagination", questionController.questionPagination);

questionRouter.get("/question/:id", questionController.readByIdQuestion);

questionRouter.get("/questionbyuser/:userId", auth.auth, questionController.readByIdUser);

questionRouter.patch("/question/:id", auth.auth, questionController.updateQuestion);

questionRouter.delete("/question/:id", auth.auth, questionController.deleteQuestion);

module.exports = questionRouter;
