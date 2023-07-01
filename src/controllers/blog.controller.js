const { Blog, User } = require("../models");
const { faker } = require("@faker-js/faker");
const blogService = require("../services/blog.service");

const parseFindQuery = (req, res) => {
  try {
    const { title, content } = req.query;
    const lowercaseTitle = title ? title.toLowerCase() : "";
    const lowercaseContent = content ? content.toLowerCase() : "";
    const query = {};

    if (title) {
      query.title = { $regex: lowercaseTitle, $options: "i" };
    }
    if (content) {
      query.content = { $regex: lowercaseContent, $options: "i" };
    }

    return query;
  } catch (error) {
    console.error("Error finding users:", error);
    throw error;
  }
};

const parseSortQuery = (sortQuery) => {
  const sort = {};
  if (sortQuery) {
    const sortKeys = Array.isArray(sortQuery) ? sortQuery : [sortQuery];
    sortKeys.forEach((key) => {
      const [field, order] = key.split(":");
      sort[field] = order || 1;
    });
  }
  return sort;
};

exports.getAllBlog = async (req, res, next) => {
  const blogsPerPage = req.query.limit;
  let currentPage = req.query.currentPage || 1;
  try {
    const sort = parseSortQuery(req.query.sort);
    const filteredBlogs = parseFindQuery(req);
    const totalCount = await blogService.countDocuments();
    const totalPages = Math.ceil(totalCount / blogsPerPage);
    if (currentPage < 1 || currentPage > totalPages) {
      return res.status(400).send("Invalid page");
    }
    const skipBlogs = blogsPerPage * (currentPage - 1);
    const blogs = await blogService.findAll(
      filteredBlogs,
      sort,
      skipBlogs,
      blogsPerPage
    );

    res.send({
      page: currentPage,
      limit: blogsPerPage,
      totalPages,
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

exports.fakeBlog = async (req, res, next) => {
  const users = await User.find();
  const arrNewBlog = [];
  try {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const blogData = {
        title: faker.lorem.words(),
        content: faker.lorem.paragraph(),
        userId: user._id,
      };
      arrNewBlog.push(blogData);
    }
    await Blog.insertMany(arrNewBlog);
    return res.status(200).send("success");
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};

exports.createBlog = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const blogData = { ...data, userId: req.user.id };
    console.log(blogData);
    await blogService.create(blogData);
    return res.status(200).send("created blog successfully");
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};

exports.deleteBlog = async (req, res, next) => {
  const { blogId } = req.params;
  const userId = req.user.id;
  try {
    const blog = await Blog.findById(blogId);
    if (JSON.stringify(blog.userId) === JSON.stringify(userId)) {
      await Blog.findByIdAndDelete(blogId, { new: true });
      return res.status(200).send("deleted blog successfully");
    }
    return res.status(404).send("404 Not Found");
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};

exports.detailBlog = async (req, res, next) => {
  const { blogId } = req.params;
  try {
    const blog = await Blog.findById(blogId);
    return res
      .status(200)
      .send({ message: "get detail blog successfully", detail: blog });
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};

exports.getTop10Blog = async (req, res, next) => {
  try {
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};

exports.getBlog30Days = async (req, res, next) => {
  try {
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};

exports.fakeBlogView = async (req, res, next) => {
  try {
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};
