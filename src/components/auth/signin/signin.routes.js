const express = require("express");

const signinRoutes = express.Router();
const { check } = require("express-validator");
const signinController = require("./signin.controller");

signinRoutes.post(
  "/signin",
  [
    check("emailId").trim().isEmail().withMessage("Valid email is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  signinController.signIn,
);
signinRoutes.get("/userrole/:id", signinController.userRole);

module.exports = signinRoutes;
