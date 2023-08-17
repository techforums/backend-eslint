const express = require("express");

const signoutRoutes = express.Router();

signoutRoutes.post("/signout", (req, res) => {
    const expirationTime = new Date(Date.now() + 0);

    const cookieString = `jwt=; HttpOnly; Expires=${expirationTime.toUTCString()};`;
    res.setHeader("Set-Cookie", cookieString);

    res.status(200).json({
        statusCode: "Success",
        headers: {
            "Set-Cookie": "signout",
            "Content-Type": "application/json",
            path: "/users",
        },
        body: {
            status: "Success",
            message: "Signed Out succefully",
            data: {

            },
        },
    });
});

module.exports = signoutRoutes;
