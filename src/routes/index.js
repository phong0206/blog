const express = require("express");
const userRoute = require("./user.route");
const blogRoute = require("./blog.route");
const router = express.Router();

router.use(express.json());
router.use("/user/auth", userRoute);
router.use("/blog/auth", blogRoute);

module.exports = router;
