const express = require("express");
const { login, register } = require("../validations/auth.validation");
const { userController } = require("../controllers");
const { validate } = require("express-validation");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", validate(register), userController.register);
router.post("/login", validate(login), userController.login);
router.get("/get-all-user", userController.getListUsers);
router.get("/profile", auth, userController.getProfile);
router.post("/fake-user", userController.fakeUser);
router.delete("/delete-all-user", userController.deleteAllUsers);
router.post("/create-user", userController.createUser);
router.delete("/delete/:id", userController.deleteUser);
router.put("/update/:id", userController.updateUser);
module.exports = router;
