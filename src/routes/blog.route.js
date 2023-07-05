const express = require("express");
const { blogController } = require("../controllers");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/get-all-blog", blogController.getAllBlog);
router.post("/fake-blog", blogController.fakeBlog);
router.post("/create-blog", auth, blogController.createBlog);
router.delete("/delete-blog/:blogId", auth, blogController.deleteBlog);
router.put("/update-blog/:blogId", auth, blogController.updateBlog);
router.get("/detail-blog/:blogId", blogController.detailBlog);
router.get("/get-detail-blog-30days", blogController.getBlog30Days);
router.post("/fake-views-blog", blogController.fakeBlogView);

router.get("/get-top-10-blog", blogController.getTop10Blogs);



module.exports = router;
