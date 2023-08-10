const crypto = require("crypto");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../../../models/user");
const UserRole = require("../../../models/userRole");
require("dotenv").config();

module.exports = {
  signIn: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          message: "Validation error",
          errors: errors.array(),
        });
      }

      const { emailId, password } = req.body;
      const { salt } = process.env;
      const user = await User.findOne({ emailId });

      if (!user) {
        return res.status(401).json({
          status: 401,
          message: "Incorrect Email or password",
        });
      }

      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");

      if (hashedPassword === user.password) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
        const expirationTime = new Date(Date.now() + 12 * 60 * 60 * 1000);

        const cookieString = `jwt=${token}; HttpOnly; SameSite=None; Secure; Expires=${expirationTime.toUTCString()};`;
        res.setHeader("Set-Cookie", cookieString);
        return res.status(200).json({
          statusCode: 200,
          headers: {
            "Set-Cookie": cookieString,
            "Content-Type": "application/json",
            path: "/users",
          },
          body: {
            status: 200,
            message: "Signed in successfully",
            data: {
              _id: user._id,
              role: user.userRole,
              name: `${user.firstName} ${user.lastName}`,
            },
          },
        });
      }
      return res.status(401).json({
        status: 401,
        message: "Incorrect Email or password",
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "Server Error",
      });
    }
  },

  userRole: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findOne({ _id: id });

      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
        });
      }

      const role = user.userRole;
      const userRole = await UserRole.findOne({ _id: role });

      return res.status(200).json({
        status: 200,
        userRole: userRole.roleName,
      });
    } catch (err) {
      if (err.name === "CastError" && err.kind === "ObjectId") {
        return res.status(400).json({
          status: 400,
          message: "Invalid Id ",
        });
      }
      return res.status(500).json({
        status: 500,
        message: `Internal Server Error: ${err.message}`,
      });
    }
  },
};
