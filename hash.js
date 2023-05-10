const bcrypt = require("bcrypt");

const getSalt = async () => {
  const salt = await bcrypt.genSalt();
  const password = "12345";
  const pdwHash = await bcrypt.hash(password, salt);
  console.log(salt);
  console.log(pdwHash);
};
getSalt();
