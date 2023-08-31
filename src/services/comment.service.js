const { Comment } = require("../models");

exports.create = async (data) => Comment.create(data);

exports.findOneByEmail = async (email) => Comment.findOne({ email }).lean();

exports.findOneById = async (userId) => Comment.findById(userId);

exports.findAll = async (f, q, k, l) =>
  Comment.find(f).sort(q).skip(k).limit(l);

exports.deleteAllUsers = async () => Comment.deleteMany({});

exports.countDocuments = async () => Comment.countDocuments();

exports.updateById = async (userId, data) =>
  Comment.findByIdAndUpdate(userId, data, { new: true });

exports.deleteById = async (userId) =>
  User.findByIdAndDelete(userId, { new: true });

exports.insertMany = async (data) => Comment.insertMany(data, { new: true });

exports.getAllUsers = async () => Comment.find();

exports.findFilter = async (data, select) => Comment.find(data).select(select);


exports.findOneAndUpdate = async (data, update) =>
  Comment.findOneAndUpdate(data, update, { new: true });

exports.upsertData = async (filter, data) =>
  Comment.updateOne(filter, { $push: data });

exports.deleteDataFromArray = async (filter, data) =>
  Comment.updateOne(filter, { $pull: data });