const mongoose = require("mongoose");

exports.connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.mongoDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
  } catch (err) {
    console.log(`Error connecting to database${err}`);
  }
};
