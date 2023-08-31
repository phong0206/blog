const { Image } = require("../models");

exports.create = async (data) => Image.create(data);

exports.findById = async (imgId) => Image.findById(imgId);


exports.deleteBlog = async (data) => Image.deleteOne(data);


exports.insertMany = async (arr) => Image.insertMany(arr);

exports.deleteById = async (id) => Image.findByIdAndDelete(id, { new: true });

exports.deleteByUserId = async (userId) => Image.deleteByUserId(userId);

exports.updateById = async (id, data) =>
  Image.findByIdAndUpdate(id, data, { new: true });

exports.getAllBlogs = async () => Image.find();

exports.deleteMany = async (arrIds) => Image.deleteMany({_id: {$in: arrIds}})


