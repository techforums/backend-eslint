const crypto = require("crypto");
const User = require("../../../models/user");
const logger = require("../../../logs/logger");
require("dotenv").config();

/**
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the status, message while signing up.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.signUp = async (req, res) => {
    try {
        const {
            firstName, lastName, emailId, password,
        } = req.body;
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            logger.log("info", "User already exists");
            return res.status(400).json({
                status: "Fail",
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
        logger.log("info", "User Created Successfully");
        return res.status(201).json({
            status: "Success",
            message: "User created successfully",
            data: emailId,
        });
    } catch (err) {
        logger.log("info", err);
        return res.status(500).json({
            status: "Fail",
            message: "Server Error",
            error: err.message,
        });
    }
};
