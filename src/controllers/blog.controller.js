const { faker } = require("@faker-js/faker");
const {
  blogService,
  userService,
  viewService,
  imageService,
  commentService,
} = require("../services");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const moment = require("moment");
const apiResponse = require("../utils/apiResponse");
const { getAllData } = require("../utils/query.util");
const _ = require("lodash");
const { sendMail } = require("../utils/mailer.util");
const config = require("../config/config");

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
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

exports.createBlog = async (req, res) => {
  const data = { ...req.body, author: req.user.name };
  const userId = req.id;
  const files = req.files;
  const photos = [];
  const arrImageIds = [];
  try {
    const user = await userService.findOneById(userId);

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
    const newBlog = await blogService.create(blogData);
    const toEmail = `${config.APP_URL}/blog/auth/detail-blog/${newBlog._id}`;
    _.each(user.friends, async (idFriend) => {
      const friend = await userService.findOneById({ _id: idFriend });
      sendMail(
        friend.email,
        `${user.name} just posted a new blog`,
        "../views/notificationForNewBlog",
        {
          name: friend.name,
          userPost: user.name,
          verificationLink: toEmail,
        }
      );
    });

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

exports.commentBlog = async (req, res) => {
  const content = req.body.content;
  const idBlog = req.params.idBlog;
  const idUser = req.id;
  try {
    const blog = await blogService.findById(idBlog);
    if (!blog) return apiResponse.notFoundResponse(res, "Blog not found");
    await commentService.create({
      id_blog: idBlog,
      id_user: idUser,
      content: content,
    });
    return apiResponse.successResponseWithData(res, "Commented successfully", {
      data: content,
    });
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

exports.repComment = async (req, res) => {
  const idComment = req.params.idComment;
  const idUser = req.id;
  const content = req.body.content;
  try {
    const comment = await comment.findOneById(idBlog);
    if (!comment) return apiResponse.notFoundResponse(res, "Comment not found");

    await commentService.create({
      id_user: idUser,
      content: content,
      id_rep_comment: idComment,
    });
    return apiResponse.successResponseWithData(res, "Commented successfully", {
      data: content,
    });
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

exports.deleteBlog = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.id;
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
      viewService.upsertData(
        {
          date: moment().startOf("day").format("YYYY-MM-DD"),
          blogId: blogId,
        },
        blog
      ),
      viewService.findFilter(
        {
          date: {
            $gte: startDate,
            $lt: moment().startOf("day").format("YYYY-MM-DD"),
          },
          blogId: blogId,
        },
        "date amount -_id"
      ),
    ]);
    if (!blog) return apiResponse.notFoundResponse(res, "Blog not found");
    return apiResponse.successResponseWithData(
      res,
      "get details blog successfully",
      {
        views_today: currentView ? currentView.amount + 1 : 1,
        detail: blog,
        detail_view_30days: viewAmountDetail,
      }
    );
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

exports.updateBlog = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.id;
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
