const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../../../models/user");
const UserRole = require("../../../models/userRole");
const logger = require("../../../logs/logger");
require("dotenv").config();

/**
 * @param {Object} req - The request object.
 * @param {Object} res -The response object.
 * @returns {Object} - The HTTP response containing the status, message, and data of signin
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
(exports.signIn = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const { salt } = process.env;
        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(401).json({
                status: "Fail",
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
            logger.log("info", "Signed in successfully!!!");
            return res.status(200).json({
                statusCode: "Success",
                headers: {
                    "Set-Cookie": cookieString,
                    "Content-Type": "application/json",
                    path: "/users",
                },
                body: {
                    status: "Success",
                    message: "Signed in successfully",
                    data: {
                        _id: user._id,
                        role: user.userRole,
                        name: `${user.firstName} ${user.lastName}`,
                    },
                },
            });
        }
        logger.log("error", "Incorrect Email or password");
        return res.status(401).json({
            status: "Fail",
            message: "Incorrect Email or password",
        });
    } catch (err) {
        logger.log("error", err);
        return res.status(500).json({
            status: "Fail",
            message: "Server Error",
        });
    }
})(exports.userRole = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({
                status: "Fail",
                message: "User not found",
            });
        }

        const role = user.userRole;
        const userRole = await UserRole.findOne({ _id: role });

        return res.status(200).json({
            status: "Success",
            userRole: userRole.roleName,
        });
    } catch (err) {
        if (err.name === "CastError" && err.kind === "ObjectId") {
            return res.status(400).json({
                status: "Fail",
                message: "Invalid Id",
            });
        }
        return res.status(500).json({
            status: 500,
            message: `Internal Server Error: ${err.message}`,
        });
    }
});
