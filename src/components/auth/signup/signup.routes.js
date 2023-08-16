const express = require("express");

const signupRoutes = express.Router();
const validator = require("../../../middleware/validator");
const signupController = require("./signup.controller");

signupRoutes.post(
  "/signup",
  validator.signUpValidation(),
  validator.validate,
  signupController.signUp,
);

module.exports = signupRoutes;
