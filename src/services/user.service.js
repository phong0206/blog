const { User } = require("../models");

const create = async (data) => {
  return User.create(data);
};

const findOne = async (filter) => {
  return User.findOne(filter).lean();
};

module.exports = {
  create,
  findOne,
};
