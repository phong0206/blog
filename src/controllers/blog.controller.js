const { faker } = require("@faker-js/faker");
const { blogService } = require("../services");
const { userService } = require("../services");
const { viewService } = require("../services");
const mongoose = require("mongoose");
const moment = require("moment");
const apiResponse = require("../utils/apiResponse");
const {
  parseSortQuery,
  getQueryFilter,
  getAllData,
} = require("../utils/query.utils");
const { application } = require("express");

exports.getAllBlog = async (req, res, next) => {
  try {
    const data = await getAllData(req, res, blogService);
    for (let i = 0; i < data.data.length; i++) {
      let view = await viewService.getAllViewsById(data.data[i].id);
      await blogService.updateById(data.data[i].id, { view: view });
    }
    return apiResponse.successResponseWithData(res, "success", {
      page: data.currentPage,
      limit: data.limit,
      totalPages: data.totalPages,
      blogs: data.data,
    });
  } catch (error) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
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
        content: faker.lorem.paragraph({ min: 50, max: 100 }),
        userId: user._id,
        createdAt: faker.date.past(),
      };
      arrNewBlog.push(blogData);
    }

    return apiResponse.successResponse(res, "Blog created successfully");
  } catch (e) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

exports.createBlog = async (req, res) => {
  try {
    const data = { ...req.body };
    const blogData = { ...data, userId: req.user.id };
    await blogService.create(blogData);
    return apiResponse.successResponseWithData(
      res,
      "created blog successfully",
      {
        detail: blogData,
      }
    );
  } catch (e) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
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

      return apiResponse.successResponse(res, "Successfully deleted blog");
    }
    return apiResponse.notFoundResponse(res, "Blog not found");
  } catch (e) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

exports.detailBlog = async (req, res) => {
  const { blogId } = req.params;
  try {
    const blog = await blogService.findById(blogId);
    if (!blog) {
      return apiResponse.notFoundResponse(res, "Blog not found");
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
    return apiResponse.successResponseWithData(
      res,
      "get details blog successfully",
      {
        detail: blog,
        detail_view_30days: filteredBlogs,
        views_today: currentView ? currentView.amount : 1,
      }
    );
  } catch (e) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
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
      return apiResponse.successResponse(res, "Successfully updated");
    }
    return apiResponse.notFoundResponse(res, "Not found for blog");
  } catch (e) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

exports.getBlog30Days = async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  try {
    const blogs = await blogService.findAndSortBy(thirtyDaysAgo);
    return apiResponse.successResponseWithData(res, "success", {
      blogs30DaysAgo: blogs,
    });
  } catch (e) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

exports.getTop10Blogs = async (req, res) => {
  try {
    const blogs = await blogService.getAllBlogs();
    for (let i = 0; i < blogs.length; i++) {
      let view = (await viewService.getAllViewsById(blogs[i].id)) || 0;
      await blogService.updateById(blogs[i].id, { view: view });
    }
    const topBlogs = await blogService.getTop10BlogsView();
    return apiResponse.successResponseWithData(res, "success", {
      Top_10_Blogs: topBlogs,
    });
  } catch (e) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

exports.fakeBlogView = async (req, res) => {
  try {
    const blogs = await blogService.getAllBlogs();
    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      const viewData = {
        amount: faker.number.int({ min: 0, max: 500 }),
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
    return apiResponse.successResponse(res, "successfully created");
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

exports.fakeRandomBlogsAndViews = async (req, res) => {
  const numberOfIds = +req.query.numberOfIds || 50;
  const arrNewBlogs = [];
  let arrNewViews = [];
  try {
    //fake blog
    const randomUser = await userService.getRandomUsers(numberOfIds);
    for (let i = 0; i < randomUser.length; i++) {
      const blogData = {
        title: faker.lorem.words(),
        content: faker.lorem.paragraph({ min: 50, max: 100 }),
        userId: randomUser[i]._id,
        createdAt: faker.date.past(),
      };
      arrNewBlogs.push(blogData);
    }
    const newBlogs = await blogService.insertManyByFaker(arrNewBlogs);
    // fake view
    for (let i = 0; i < newBlogs.length; i++) {
      const blog = newBlogs[i];
      const currentDate = moment();
      for (let j = 1; j <= 30; j++) {
        const viewData = {
          amount: faker.number.int({ min: 0, max: 500 }),
          blogId: blog._id,
          date: moment(currentDate).subtract(j, "days"),
        };
        arrNewViews.push(viewData);
      }
      await viewService.insertMany(arrNewViews);
      arrNewViews = [];
    }

    return apiResponse.successResponse(res, "success");
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};
