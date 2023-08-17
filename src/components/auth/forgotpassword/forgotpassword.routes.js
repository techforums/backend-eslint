const express = require("express");

const forgotpasswordRoutes = express.Router();
const forgotpasswordController = require("./forgotpassword.controller");

forgotpasswordRoutes.post("/", forgotpasswordController.forgotPassword);
forgotpasswordRoutes.post(
    "/reset-password",
    forgotpasswordController.resetPassword,
);

module.exports = forgotpasswordRoutes;
