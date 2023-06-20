const { User } = require("../models");

const create = async (data) => {
  return User.create(data);
};

const findOneByUsername = async (username) => {
  return User.findOne({ username }).lean();
};

const findOneById = async (id) => {
  return User.findOne({ id: _id }).lean();
};

const findAll = async (filter) => {
  return User.findAll(filter).lean();
};
module.exports = {
  create,
  findOneByUsername,
  findOneById,
  findAll,
};
