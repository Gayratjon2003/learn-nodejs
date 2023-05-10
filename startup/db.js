const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");
module.exports = async function () {
  try {
    await mongoose.connect(config.get("db"), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // Connection successful, continue with your logic here
    winston.debug("mongoDb connected..");
  } catch (error) {
    // Connection failed, handle the error here
    winston.error("Error: ", error);
  }
};


