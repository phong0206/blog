const express = require("express");
const validateUser = require("../middlewares/validate");
const router = express.Router();
const {
  register,
  login,
  getListUsers,
} = require("../controllers/user.controller");

router.post("/register", validateUser, register);

router.post("/login", validateUser, login);
router.get("/", getListUsers);
module.exports = router;
