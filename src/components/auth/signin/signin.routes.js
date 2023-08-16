const express = require("express");

const signinRoutes = express.Router();
const signinController = require("./signin.controller");
const validator = require("../../../middleware/validator");

signinRoutes.post(
  "/signin",
  validator.signInValidation(),
  validator.validate,
  signinController.signIn,
);
signinRoutes.get("/userrole/:id", signinController.userRole);

module.exports = signinRoutes;
