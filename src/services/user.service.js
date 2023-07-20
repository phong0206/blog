const { User } = require("../models");

exports.create = async (data) => User.create(data);

exports.findOneByEmail = async (email) => User.findOne({ email }).lean();

exports.findOneById = async (userId) => User.findById(userId);

exports.findAll = async (f, q, k, l) => User.find(f).sort(q).skip(k).limit(l);

exports.deleteAllUsers = async () => User.deleteMany({});

exports.countDocuments = async () => User.countDocuments();

exports.updateById = async (userId, data) =>
  User.findByIdAndUpdate(userId, data, { new: true });

exports.deleteById = async (userId) =>
  User.findByIdAndDelete(userId, { new: true });

exports.insertMany = async (data) => User.insertMany(data, { new: true });

exports.getAllUsers = async () => User.find();

exports.findFilter = async (data, select) => User.find(data).select(select);

exports.getRandomUsers = async (numberOfIds) =>
  User.aggregate([
    { $sample: { size: numberOfIds } },
    { $project: { _id: 1 } },
  ]);
exports.findOneAndUpdate = async (data, update) =>
  User.findOneAndUpdate(data, update, { new: true });
