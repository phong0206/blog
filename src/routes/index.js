const express = require("express");
const userRoute = require("./user.route");
const blogRoute = require("./blog.route");
const imageRoute = require("./image.route");
const router = express.Router();


router.use("/user/auth", userRoute);
router.use("/blog/auth", blogRoute);
router.use("/image", imageRoute);

module.exports = router;
