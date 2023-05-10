const config = require("config");
module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    console.error(
      "JIDDIY XATO: virtualdars_jwtPrivateKey muhiti o'zgaruvchisi aniqlanmagan"
    );
    throw new Error(
      "JIDDIY XATO: virtualdars_jwtPrivateKey muhiti o'zgaruvchisi aniqlanmagan"
    );
  }
};
