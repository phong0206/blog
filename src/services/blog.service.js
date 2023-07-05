const { Blog } = require("../models");

exports.create = async (data) => Blog.create(data);

exports.findById = async (blogId) => Blog.findById(blogId);

exports.findLatestBlog = async () =>
  Blog.find({}).sort({ createdAt: -1 }).limit(1).exec();

exports.deleteBlog = async (data) => Blog.deleteOne(data);

exports.getAll = async () =>
  Blog.find({}, { title: 1, content: { $substr: ["$content", 0, 100] } });

exports.insertManyByFaker = async (arr) => Blog.insertMany(arr);

exports.findAll = async (f, q, k, l) => Blog.find(f).sort(q).skip(k).limit(l);

exports.countDocuments = async () => Blog.countDocuments();

exports.deleteById = async (id) => Blog.findByIdAndDelete(id, { new: true });

exports.updateById = async (id, data) =>
  Blog.findByIdAndUpdate(id, data, { new: true });

exports.findAndSort = async (date) =>
  Blog.find().sort({ createdAt: 1 }).where("createdAt").gte(date);

exports.getAllBlogs = async () => Blog.find();
