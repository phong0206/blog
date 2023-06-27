const { User } = require("../models");

const create = async (data) => User.create(data);

const findOneByUsername = async (username) => User.findOne({ username }).lean();

const findOneById = async (userId) => User.findById(userId);

const findAll = async (q) => User.find({}).sort(q);

const saveRefreshTokenToUser = async (userId, refreshToken) =>
  User.findByIdAndUpdate(userId, { refreshToken: refreshToken }, { new: true });

const findUserByRefreshToken = async (refreshToken) =>
  User.findOne({ refreshToken }).lean();

const removeRefreshTokenFromUser = async (userId) =>
  User.findByIdAndUpdate(userId, { refreshToken: null }, { new: true });
module.exports = {
  create,
  findOneByUsername,
  findOneById,
  findAll,
  saveRefreshTokenToUser,
  findUserByRefreshToken,
  removeRefreshTokenFromUser,
};
