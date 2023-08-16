/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable prefer-template */
/* eslint-disable no-sequences */
const mongoose = require("mongoose");
const logger = require("./logs/logger");

(connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.mongoDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to database");
  } catch (err) {
    logger.error("Error connecting to database" + err);
  }
}),
// eslint-disable-next-line no-undef
(module.exports = connectToDatabase);
