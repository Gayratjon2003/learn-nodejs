const winston = require("winston");
require("express-async-errors");
require("winston-mongodb");
module.exports = function () {
  winston.add(new winston.transports.Console());
  winston.add(
    new winston.transports.File({
      filename: "logs/vd-logs.log",
      level: "error",
    })
  );
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://127.0.0.1:27017/virtualdars-logs",
      level: "warning",
    })
  );
  winston.exceptions.handle(
    new winston.transports.File({ filename: "logs/vd-logs.log" })
  );
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};

// process.on("uncaughtException", (ex) => {
//   winston.error(ex.message, ex);
//   process.exit(1);
// });
// process.on("unhandledRejection", (ex) => {
//   winston.error("unhandledRejection xatosi \n " + ex.message, ex);
//   process.exit(1);
// });