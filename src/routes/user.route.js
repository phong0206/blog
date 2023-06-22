const express = require("express");
const { login, register } = require("../validations/auth.validation");
const { userController } = require("../controllers");
const { validate } = require("express-validation");
const router = express.Router();

router.post("/register", validate(register), userController.register);

router.post("/login", validate(login), userController.login);
router.get("/", userController.getListUsers);
module.exports = router;
