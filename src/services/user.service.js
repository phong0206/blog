const { User } = require("../models");

const create = async (data) => User.create(data);

const findOneByUsername = async (username) => User.findOne({ username }).lean();

const findOneById = async (userId) => User.findById(userId);

const findAll = async (f,q,k,l) => User.find(f).sort(q).skip(k).limit(l);

module.exports = {
  create,
  findOneByUsername,
  findOneById,
  findAll,
};
