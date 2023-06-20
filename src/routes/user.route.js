const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getListUsers
} = require("../controllers/user.controller");

router.post("/register", register);

router.post("/login", login);
router.get("/", getListUsers);
module.exports = router;
