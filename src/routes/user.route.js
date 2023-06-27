const express = require("express");
const { login, register } = require("../validations/auth.validation");
const { userController } = require("../controllers");
const { validate } = require("express-validation");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", validate(register), userController.register);
router.post("/login", validate(login), userController.login);
router.get("/", auth, userController.getListUsers);
router.get("/profile", auth, userController.getProfile);
router.post("/refreshToken", userController.userRefreshToken);
router.post("/logout",auth, userController.logout);
module.exports = router;
