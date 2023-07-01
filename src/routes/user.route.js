const express = require("express");
const { login, register } = require("../validations/auth.validation");
const { userController } = require("../controllers");
const { validate } = require("express-validation");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", validate(register), userController.register);
router.post("/login", validate(login), userController.login);
router.get("/get", userController.getListUsers);
router.get("/profile", auth, userController.getProfile);
router.get("/fakeuser", userController.fakeUser);
router.get("/deleteAllUser", userController.deleteAllUsers);
router.post("/createUser", userController.createUser);
router.get("/delete/:id", userController.deleteUser);
router.put("/update/:id", userController.updateUser);
module.exports = router;
