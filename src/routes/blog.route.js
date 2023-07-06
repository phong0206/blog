const express = require("express");
const { blogController } = require("../controllers");
const { auth, checkAdminAuth } = require("../middlewares/auth");
const router = express.Router();

router.get("/get-all-blog", blogController.getAllBlog);
router.post("/fake-blog", auth, checkAdminAuth, blogController.fakeBlog);
router.post("/create-blog", auth, blogController.createBlog);
router.delete("/delete-blog/:blogId", auth, blogController.deleteBlog);
router.put("/update-blog/:blogId", auth, blogController.updateBlog);
router.get("/detail-blog/:blogId", blogController.detailBlog);
router.get("/get-detail-blog-30days", blogController.getBlog30Days);
router.post(
  "/fake-views-blog",
  auth,
  checkAdminAuth,
  blogController.fakeBlogView
);
router.get(
  "/get-top-10-blog",
  auth,
  checkAdminAuth,
  blogController.getTop10Blogs
);
router.get(
  "/fake-random",
  auth,
  checkAdminAuth,
  blogController.fakeRandomBlogsAndViews
);

module.exports = router;
