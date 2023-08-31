const { User_Connection } = require("../models");

exports.create = async (data) => User_Connection.create(data);

exports.findOneByField = async (data) => User_Connection.findOne(data);

exports.findOneById = async (userId) => User_Connection.findById(userId);

exports.deleteAllUsers = async () => User_Connection.deleteMany({});

exports.countDocuments = async () => User_Connection.countDocuments();

exports.updateById = async (userId, data) =>
  User_Connection.findByIdAndUpdate(userId, data, { new: true });

exports.deleteById = async (userId) =>
  User_Connection.findByIdAndDelete(userId, { new: true });

exports.insertMany = async (data) =>
  User_Connection.insertMany(data, { new: true });

exports.getAllUsers = async () => User_Connection.find();

exports.findFilter = async (data, select) =>
  User_Connection.find(data).select(select);

exports.findOneAndUpdate = async (data, update) =>
  User_Connection.findOneAndUpdate(data, update, { new: true });

exports.findOneAndDelete = async (filter) =>
  User_Connection.findOneAndDelete(filter, { new: true });


