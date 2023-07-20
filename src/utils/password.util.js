const bcrypt = require("bcryptjs");

exports.hashData = (password) => {
  return bcrypt.hashSync(password, 10);
};

exports.compareData = (reqPassword, userPassword) => {
  return bcrypt.compareSync(reqPassword, userPassword);
};

