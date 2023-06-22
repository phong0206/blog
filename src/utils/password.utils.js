const bcrypt = require("bcryptjs");

exports.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

exports.comparePassword = (reqPassword, userPassword) => {
  return bcrypt.compareSync(reqPassword, userPassword);
};
