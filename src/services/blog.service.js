const Blog = require("../models/blog.model");

exports.create = async (data) => Blog.create(data);

exports.findById = async (blogId) =>
  Blog.findById(blogId).sort({ createdAt: -1 }).lean().exec();

exports.findLatestBlog = async () =>
  Blog.find({}).sort({ createdAt: -1 }).limit(1).exec();

exports.deleteBlog = async (data) => Blog.deleteOne(data);

exports.getAll = async () =>
  Blog.find({}, { title: 1, content: { $substr: ["$content", 0, 100] } });

exports.insertManyByFaker = async (arr) => Blog.insertMany(arr);

exports.findAll = async (f, q, k, l) => Blog.find(f).sort(q).skip(k).limit(l);

exports.countDocuments = async () => Blog.countDocuments();
