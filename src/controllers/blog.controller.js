const { faker } = require("@faker-js/faker");
const { blogService } = require("../services");
const { userService } = require("../services");
const { viewService } = require("../services");
const mongoose = require("mongoose");

const moment = require("moment");
const { parseFindQueryBlog, parseSortQuery } = require("../utils/query.utils");

exports.getAllBlog = async (req, res, next) => {
  const blogsPerPage = req.query.limit;
  let currentPage = req.query.currentPage || 1;
  try {
    const sort = parseSortQuery(req.query.sort);
    const filteredBlogs = parseFindQueryBlog(req);
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
    for (let i = 0; i < blogs.length; i++) {
      blogs[i].view = await viewService.getAllViewsById(blogs[i].id);
    }

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

exports.fakeBlog = async (req, res) => {
  const arrNewBlog = [];
  try {
    const users = await userService.getAllUsers();
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
    await blogService.insertManyByFaker(arrNewBlog);
    return res.status(200).send("success");
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};

exports.createBlog = async (req, res) => {
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

exports.deleteBlog = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user.id;
  try {
    const blog = await blogService.findById(blogId);
    if (blog.userId.toString() === userId) {
      //handle transaction
      const session = await mongoose.startSession();
      session.startTransaction();
      await blogService.deleteById(blogId, session);
      await viewService.deleteMany({ blogId: blog.id }, session);
      await session.commitTransaction();
      session.endSession();

      return res.status(200).send("deleted blog successfully");
    }
    return res.status(404).send("404 Not Found");
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};

exports.detailBlog = async (req, res) => {
  const { blogId } = req.params;
  try {
    const blog = await blogService.findById(blogId);
    if (!blog) {
      return res.status(404).send({ message: "Blog Not Found" });
    }
    const currentView = await viewService.findOne({
      date: moment().startOf("day"),
      blogId: blog._id,
    });
    if (!currentView) {
      await viewService.create({
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
    const viewAmountDetail = await viewService.find({
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

exports.updateBlog = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user.id;
  try {
    const data = { ...req.body };
    const blog = await blogService.findById(blogId); // check blog exists
    if (JSON.stringify(blog.userId) === JSON.stringify(userId)) {
      await blogService.updateById(blogId, data);
      return res.status(200).send("updated blog successfully");
    }
    return res.status(404).send("404 Not Found");
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};

exports.getBlog30Days = async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  try {
    const blogs = await blogService.findAndSortBy(thirtyDaysAgo);
    return res.status(200).send({ message: "success", blogs30DaysAgo: blogs });
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};

exports.getTop10Blogs = async (req, res) => {
  try {
    const arrBlog = [];
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};

exports.fakeBlogView = async (req, res) => {
  try {
    const blogs = await blogService.getAllBlogs();
    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      const viewData = {
        amount: faker.number.int({ min: 0, max: 1000 }),
        blogId: blog._id,
      };
      const comparseData = await viewService.find({ blogId: blog._id });
      if (comparseData.length > 0) {
        let exists;
        do {
          viewData.date = faker.date.past();
          exists = comparseData.some((data) => data.date === viewData.date);
        } while (exists);
      }
      await viewService.create(viewData);
    }
    return res.status(200).send("success");
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};
