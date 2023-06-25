const { User } = require("../models");

const create = async (data) => {
  return User.create(data);
};

const findOneByUsername = async (username) => {
  return User.findOne({ username }).lean();
};

const findOneById = async (id) => {
  return User.findOne({ id: id }).lean();
};

const findAll = async (q) => {
  return User.find({}).sort(q);
};

module.exports = {
  create,
  findOneByUsername,
  findOneById,
  findAll,
};
