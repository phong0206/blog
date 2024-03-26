const express = require("express");
const { blogController } = require("../controllers");
const { auth, checkAdminAuth } = require("../middlewares/auth");
const router = express.Router();
const { upload, uploadMultiple } = require("../config/multer.config");
const { validate } = require("express-validation");
const { getAllBlog } = require("../validations/auth.validation");



   

router.post("/comment-blog/:idBlog", auth, blogController.commentBlog);
router.post("/rep-comment-blog/:idComment", auth, blogController.repComment);

router.get("/get-all-blogs", validate(getAllBlog), blogController.getAllBlog);


router.post(
  "/create-blog",
  auth,
  uploadMultiple,
  blogController.createBlog
);
router.delete("/delete-blog/:blogId", auth, blogController.deleteBlog);
router.put("/update-blog/:blogId", auth, blogController.updateBlog);
router.get("/detail-blog/:blogId", blogController.detailBlog);
router.get("/get-detail-blogs-30days", blogController.getBlog30Days);
router.get("/get-top-10-blogs", auth, blogController.getTop10Blogs); 
router.post(
  "/fake-random",
  auth,
  checkAdminAuth,
  blogController.fakeRandomBlogsAndViews
);

module.exports = router;
