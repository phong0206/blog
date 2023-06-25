const express = require("express");
const { login, register } = require("../validations/auth.validation");
const { userController } = require("../controllers");
const { validate } = require("express-validation");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", validate(register), userController.register);

router.post("/login", validate(login), userController.login);
router.get("/", userController.getListUsers);
router.get("/profile", auth, userController.getProfile);
module.exports = router; 
