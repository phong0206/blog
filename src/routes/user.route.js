const express = require("express");
const {
  login,
  register,
  getAllUser,
} = require("../validations/auth.validation");
const { userController } = require("../controllers");
const { validate } = require("express-validation");
const {
  auth,
  checkAdminAuth,
  authVerifyAccount,
} = require("../middlewares/auth");
const router = express.Router();

router.post("/addfriend/:id", auth, userController.sendReqAddFriend);
router.post(
  "/accept-friend/:friendId",
  auth,
  userController.acceptFriendRequest
);
router.delete(
  "/revoke-friend-request/:id",
  auth,
  userController.revokeFriendRequest
);
router.delete(
  "/unfriend/:id",
  auth,
  userController.unfriend
);
router.get("/verify", userController.verifyRegister);
router.post("/supply-new-password", userController.supplyNewPassword);
router.get("/get-new-password", userController.getNewPassword);
router.post("/register", validate(register), userController.register);
router.post("/login", validate(login), authVerifyAccount, userController.login);
router.get(
  "/get-all-users",
  auth,
  checkAdminAuth,
  userController.getListUsers
);
router.get("/profile", auth, userController.getProfile);
router.post("/fake-users", auth, checkAdminAuth, userController.fakeUser);
router.delete(
  "/delete-all-users",
  auth,
  checkAdminAuth,
  userController.deleteAllUsers
);
router.post("/create-user", auth, checkAdminAuth, userController.createUser);
router.delete("/delete/:id", userController.deleteUser);
router.put("/update", auth, userController.updateUser);
router.post("/logout", userController.logout);

module.exports = router;
