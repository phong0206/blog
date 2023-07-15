const { faker } = require("@faker-js/faker");
const {
  blogService,
  userService,
  viewService,
  imageService,
} = require("../services");
const { View } = require("../models");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const moment = require("moment");
const apiResponse = require("../utils/apiResponse");
const { getAllData } = require("../utils/query.utils");
const _ = require("lodash");

const EventEmitter = require("events");
const ee = new EventEmitter();

ee.on("update-view-amount", async (currentView, blog) => {
  try {
    if (!currentView) {
      await viewService.create({
        amount: 1,
        date: moment().startOf("day").format("YYYY-MM-DD"),
        blogId: blog?._id,
      });
    } else {
      await viewService.updateById(currentView._id, {
        amount: currentView.amount + 1,
      });
    }
  } catch (error) {
    console.error("Error updating view amount:", error);
  }
});

exports.getAllBlog = async (req, res, next) => {
  try {
    const data = await getAllData(req, res, blogService);

    // let view = _.sumBy(data,)
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
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

exports.createBlog = async (req, res) => {
  const data = { ...req.body };
  const userId = req.user.id;
  const files = req.files;
  const photos = [];
  const arrImageIds = [];
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    if (files) {
      _.each(files, (file) => {
        photos.push(file);
      });

      const savedImage = await imageService.insertMany(photos);
      _.each(savedImage, (img) => {
        arrImageIds.push(img._id);
      });
    }
    const blogData = { ...data, userId: userId, imageId: arrImageIds || [] };
    await blogService.create(blogData);

    await session.commitTransaction();
    session.endSession();

    return apiResponse.successResponseWithData(
      res,
      "created blog successfully",
      {
        detail: blogData,
      }
    );
  } catch (err) {
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
      const session = await mongoose.startSession();
      session.startTransaction();
      if (blog.imageId) {
        const image = await imageService.findById(blog.imageId);
        const imagePath = path.join(__dirname, "../../uploads", image.filename);
        fs.unlinkSync(imagePath);
        await imageService.deleteMany(blog.imageId);
      }
      await Promise.all([
        blogService.deleteById(blogId, session),
        viewService.deleteMany({ blogId: blog.id }, session),
      ]);
      await session.commitTransaction();
      session.endSession();

      return apiResponse.successResponse(res, "Successfully deleted blog");
    }
    return apiResponse.notFoundResponse(res, "Blog not found");
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

exports.detailBlog = async (req, res) => {
  const { blogId } = req.params;
  const startDate = moment()
    .subtract(42, "days")
    .startOf("day")
    .format("YYYY-MM-DD");
  try {
    const blog = await blogService.findById(blogId);
    const [currentView, viewAmountDetail] = await Promise.all([
      viewService.findOne({
        date: moment().startOf("day").format("YYYY-MM-DD"),
        blogId: blogId,
      }),
      viewService.findFilter(
        {
          date: { $gte: startDate },
          blogId: blogId,
        },
        "date amount -_id"
      ),
    ]);
    if (!blog) return apiResponse.notFoundResponse(res, "Blog not found");
    ee.emit("update-view-amount", currentView, blog);
    return apiResponse.successResponseWithData(
      res,
      "get details blog successfully",
      {
        detail: blog,
        detail_view_30days: viewAmountDetail,
        views_today: currentView ? currentView.amount + 1 : 1,
      }
    );
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

exports.updateBlog = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user.id;
  const data = { ...req.body };
  try {
    const blog = await blogService.findById(blogId);
    if (!blog) return apiResponse.notFoundResponse(res, "Blog not found");

    if (blog.userId.toString() === userId) {
      await blogService.updateById(blogId, data);

      return apiResponse.successResponse(res, "Successfully updated");
    }
    return apiResponse.notFoundResponse(res, "Not found for blog");
  } catch (err) {
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
  } catch (err) {
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
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

exports.fakeRandomBlogsAndViews = async (req, res) => {
  const numberOfIds = +req.query.numberOfIds || 50;
  try {
    //fake blog
    const randomUser = await userService.getRandomUsers(numberOfIds);
    const arrNewBlogs = _.map(randomUser, (user) => ({
      title: faker.lorem.words(),
      content: faker.lorem.paragraph({ min: 50, max: 100 }),
      userId: user._id,
      createdAt: faker.date.past(),
    }));
    const session = await mongoose.startSession();
    session.startTransaction();
    const newBlogs = await blogService.insertManyByFaker(arrNewBlogs);
    console.log(newBlogs[1]._id);
    // fake view
    _.map(newBlogs, async (blog) => {
      const currentDate = moment();
      const arrNewViews = _.times(30, (j) => ({
        amount: faker.number.int({ min: 0, max: 500 }),
        blogId: blog._id,
        date: moment(currentDate)
          .subtract(j + 1, "days")
          .format("YYYY-MM-DD"),
      }));
      await viewService.insertMany(arrNewViews);
    });
    
    await session.commitTransaction();
    session.endSession();

    return apiResponse.successResponse(res, "success");
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};
