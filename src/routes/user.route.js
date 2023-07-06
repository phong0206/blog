const express = require("express");
const { login, register } = require("../validations/auth.validation");
const { userController } = require("../controllers");
const { validate } = require("express-validation");
const { auth, checkAdminAuth } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", validate(register), userController.register);
router.post("/login", validate(login), userController.login);
router.get("/get-all-user", auth, checkAdminAuth, userController.getListUsers);
router.get("/profile", auth, userController.getProfile);
router.post("/fake-user", auth, checkAdminAuth, userController.fakeUser);
router.delete(
  "/delete-all-user",
  auth,
  checkAdminAuth,
  userController.deleteAllUsers
);
router.post("/create-user", auth, checkAdminAuth, userController.createUser);
router.delete("/delete/:id", userController.deleteUser);
router.put("/update/:id", userController.updateUser);
module.exports = router;
