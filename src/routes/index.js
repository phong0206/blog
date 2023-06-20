const express = require("express");
const userRoute = require("./user.route");

const router = express.Router();

router.use(express.json());
router.use("/user/auth", userRoute);

module.exports = router;
