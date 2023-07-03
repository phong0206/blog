const { Blog, User, View } = require("../models");
const { faker } = require("@faker-js/faker");
const blogService = require("../services/blog.service");
const moment = require("moment");
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
        createdAt: faker.date.past(),
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

    await blogService.create(blogData);
    return res
      .status(200)
      .send({ message: "created blog successfully", detail: blogData });
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
      await View.deleteMany({ blogId: blog.id }, { new: true });
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
    if (!blog) {
      return res.status(404).send({ message: "Blog Not Found" });
    }
    const currentView = await View.findOne({
      date: moment().startOf("day"),
      blogId: blog._id,
    });
    if (!currentView) {
      console.log("No view found");
      View.create({
        amount: 1,
        date: moment().startOf("day"),
        blogId: blog._id,
      });
    }
    if (currentView) {
      currentView.amount += 1;
      await currentView.save();
    }
    const startDate = moment().subtract(30, "days").startOf("day");
    const viewAmountDetail = await View.find({
      date: { $gte: startDate },
      blogId: blog._id,
    });
    const filteredBlogs = viewAmountDetail.map(({ date, amount }) => ({
      date,
      amount,
    }));
    return res.status(200).send({
      message: "get detail blog successfully",
      detail: blog,
      detail_view_30days: filteredBlogs,
      views_today: currentView ? currentView.amount : 1,
    });
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};

exports.updateBlog = async (req, res, next) => {
  const { blogId } = req.params;
  const userId = req.user.id;
  try {
    const data = { ...req.body };
    const blog = await Blog.findById(blogId); // check blog exists
    console.log(blog.userId);
    console.log(userId);
    if (JSON.stringify(blog.userId) === JSON.stringify(userId)) {
      await Blog.findByIdAndUpdate(blogId, data, { new: true });
      return res.status(200).send("updated blog successfully");
    }
    return res.status(404).send("404 Not Found");
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};

exports.getBlog30Days = async (req, res, next) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: 1 })
      .where("createdAt")
      .gte(thirtyDaysAgo);
    return res.status(200).send({ message: "success", blogs30DaysAgo: blogs });
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};

exports.getTop10Blog = async (req, res, next) => {
  try {
    const arrBlog = [];
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};

exports.fakeBlogView = async (req, res, next) => {
  const blogs = await Blog.find();
  const arrNewView = [];
  try {
    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      const viewData = {
        date: faker.date.past(),
        amount: faker.number.int({ min: 0, max: 1000 }),
        blogId: blog._id,
      };
      arrNewView.push(viewData);
    }
    await View.insertMany(arrNewView);
    return res.status(200).send("success");
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};
