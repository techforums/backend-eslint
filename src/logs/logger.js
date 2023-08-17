const winston = require("winston");
const { format } = require("winston");

const logger = winston.createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.json(),
    ),
    transports: [
        new winston.transports.File({ filename: "logs/logs.log" }),
    ],
});

module.exports = logger;
