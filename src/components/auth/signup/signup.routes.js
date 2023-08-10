const express = require("express");

const signupRoutes = express.Router();
const { check } = require("express-validator");
const signupController = require("./signup.controller");

signupRoutes.post(
  "/signup",
  [
    check("firstName")
      .trim()
      .notEmpty()
      .withMessage("First name is required"),
    check("lastName")
      .trim()
      .notEmpty()
      .withMessage("Last name is required"),
    check("emailId")
      .trim()
      .isEmail()
      .withMessage("Valid email is required")
      .custom((value) => {
        if (!value.endsWith("@gmail.com")) {
          throw new Error("Email must end with @gmail.com");
        }
        return true;
      }),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, "i")
      .withMessage("Password must contain at least one lowercase letter, one uppercase letter, one special character, and one number"),
    check("confirmPassword")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
  ],
  signupController.signUp,
);

module.exports = signupRoutes;
