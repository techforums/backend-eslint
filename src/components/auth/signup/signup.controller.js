const crypto = require("crypto");
const { validationResult } = require("express-validator");
const User = require("../../../models/user");
require("dotenv").config();

module.exports = {
  signUp: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          message: "Validation error",
          errors: errors.array(),
        });
      }

      const {
        firstName, lastName, emailId, password,
      } = req.body;
      const existingUser = await User.findOne({ emailId });
      if (existingUser) {
        return res.status(400).json({
          status: 400,
          message: "Email already exists",
        });
      }

      const { salt } = process.env;
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");

      const user = new User({
        firstName,
        lastName,
        emailId,
        password: hashedPassword,
        userRole: process.env.userRole,
      });

      await user.save();

      return res.status(201).json({
        status: 201,
        message: "User created successfully",
        data: emailId,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "Server Error",
        error: err.message,
      });
    }
  },
};
