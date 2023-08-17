const jwt = require("jsonwebtoken");
require("dotenv").config();
const logger = require("../logs/logger");

exports.auth = async (req, res, next) => {
    let check = req.headers.cookie;
    if (check === undefined) {
        logger.log("error", "Need to Sign In!!");
        return res.status(401).json({
            status: 401,
            message: "Need to Sign In",
        });
    }
    check = check.slice(4, check.length);

    const token = check;
    if (!token) {
        return res.status(401).json({
            status: 401,
            message: "Need to Sign In",
        });
    }
    try {
    // eslint-disable-next-line no-undef
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decode.userId;
    } catch (err) {
        return res.status(401).json({
            status: 401,
            message: "You are not authorized",
        });
    }
    return next();
};
