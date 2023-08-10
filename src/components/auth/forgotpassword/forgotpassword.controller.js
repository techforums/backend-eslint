const crypto = require("crypto");
const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const User = require("../../../models/user");
require("dotenv").config();

module.exports = {
  forgotPassword: async (req, res) => {
    try {
      const { emailId } = req.body;
      const { url } = process.env;
      const user = await User.findOne({ emailId });
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
        });
      }

      const transporter = nodemailer.createTransport(
        {
          service: "gmail",
          auth: {
            user: process.env.emailUser,
            pass: process.env.emailPassword,
          },
        },
        { from: "TechForum" },
      );
      const from = "TechForum <techforum.forum@gmail.com>";

      const handlebarOptions = {
        viewEngine: {
          partialsDir: path.resolve("./views/"),
          defaultLayout: false,
        },
        viewPath: path.resolve("./views/"),
      };
      transporter.use("compile", hbs(handlebarOptions));
      const mailOptions = {
        from,
        to: emailId,
        subject: "Reset Your Password",
        template: "email",
        context: {
          name: user.firstName,
          emailId: user.emailId,
          link: url + user._id,
        },
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          res.status(500).json({
            status: 500,
            message: "Server Error",
          });
        } else {
          res
            .cookie("email", emailId, {
              maxAge: 900000,
              httpOnly: true,
              path: "/forgotpassword",
            })
            .status(201)
            .json({
              status: 201,
              message: "Reset password email sent",
            });
        }
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "Server Error",
        data: err,
      });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const password = req.body.newPassword;
      const confirmpassword = req.body.confirmPassword;
      const { salt } = process.env;
      const { email } = req.cookies;
      if (!email || !password) {
        return res.status(404).json({
          status: 404,
          message: "Missing email or password",
        });
      }
      const user = await User.findOne({ emailId: email });
      const { userId } = req.params;

      if (!user) {
        return res.status(400).json({
          status: 400,
          message: "Invalid Email or user",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          status: 400,
          message: "Password must be at least 6 characters long",
        });
      }
      if (password !== confirmpassword) {
        return res.status(401).json({
          status: 401,
          message: "Password not matched",
        });
      }
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");
      user.password = hashedPassword;
      await user.save();
      res.clearCookie("email", { path: "/forgotpassword" }).status(201).json({
        status: 201,
        message: "Password updated successfully",
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "Server Error",
        data: err,
      });
    }
  },
};
