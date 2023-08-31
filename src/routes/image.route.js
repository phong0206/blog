const express = require("express");
const { imageController } = require("../controllers");
const { auth } = require("../middlewares/auth");
const { upload } = require("../config/multer.config");

const router = express.Router();

router.post(
  "/profile",
  auth,
  upload.single("avatar"),
  imageController.uploadAvatar
);
router.delete("/profile/:id", auth, imageController.deleteAvatar);
router.put(
  "/change-avatar",
  auth,
  upload.single("avatar_change"),
  imageController.changeAvatar
);

module.exports = router;
