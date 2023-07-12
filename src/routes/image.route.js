const express = require("express");
const { imageController } = require("../controllers");
const { auth, checkAdminAuth } = require("../middlewares/auth");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

router.post(
  "/profile",
  auth,
  upload.single("avatar"),
  imageController.uploadAvatar
);
router.post(
  "/photos/upload",
  auth,
  upload.array("photos", 12),
  imageController.uploadPhotos
);
router.delete("/profile/:id", auth, imageController.deleteAvatar);
router.put(
  "/change-avatar",
  auth,
  upload.single("avatar_change"),
  imageController.changeAvatar
);

module.exports = router;
