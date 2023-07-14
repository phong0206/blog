const { View } = require("../models");

exports.deleteMany = async (id) => View.deleteMany(id, { new: true });

exports.findOne = async (data) => View.findOne(data);

exports.create = async (data) => View.create(data);

exports.find = async (data) => View.find(data);

exports.insertMany = async (arr) => View.insertMany(arr);

exports.getAllViewsById = async (id) => {
  const views = await View.find({ blogId: id });
  return views.reduce((total, view) => total + view.amount, 0);
};
exports.findFilter = async (data, select) => View.find(data).select(select).sort({date: -1});

exports.updateById = async (id, data) => View.findByIdAndUpdate(id, data);
