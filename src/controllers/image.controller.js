const fs = require("fs");
const path = require("path");
const apiResponse = require("../utils/apiResponse");
const mongoose = require("mongoose");

const { imageService, userService } = require("../services");

const EventEmitter = require("events");
const ee = new EventEmitter();

ee.on("save-avatarId-to-UserDb", async (userId, savedImage) => {
  try {
    await userService.updateById(userId, { avatarId: savedImage._id });
  } catch (err) {
    console.error(err.message);
  }
});


const uploadAvatar = async (req, res) => {
  const userId = req.id;
  try {
    if (req.file) {
      const data = { ...req.file };
      if (!data) return apiResponse.notFoundResponse(res, "image not found");
      const session = await mongoose.startSession();
      session.startTransaction();

      const savedImage = await imageService.create(data);
      ee.emit("save-avatarId-to-UserDb", userId, savedImage);
      await session.commitTransaction();
      session.endSession();

      return apiResponse.successResponseWithData(
        res,
        "uploaded Successfully",
        savedImage
      );
    } else {
      return apiResponse.notFoundResponse(res, "image not found");
    }
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const changeAvatar = async (req, res, next) => {
  const userId = req.id;
  const imageChange = { ...req.file };
  const avatarId = req.user.avatarId;
  try {
    if (!imageChange)
      return apiResponse.notFoundResponse(res, "image not found");

    //delete in folder
    const image = await imageService.findById({ _id: avatarId });

    const imagePath = path.join(__dirname, "../../uploads", image.filename);
    fs.unlinkSync(imagePath);

    const session = await mongoose.startSession();
    session.startTransaction();

    const [updateImg, deleteImg, savedImage] = await Promise.all([
      //delete avatarId
      userService.updateById(userId, {
        $unset: { avatarId: avatarId },
      }),
      // delete document image
      imageService.deleteById(avatarId),
      imageService.create(imageChange),
    ]);
    // upload new avatar
    ee.emit("save-avatarId-to-UserDb", userId, savedImage);
    await session.commitTransaction();
    session.endSession();

    return apiResponse.successResponseWithData(
      res,
      "uploaded Successfully",
      savedImage
    );
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const deleteAvatar = async (req, res) => {
  const { id } = req.params;
  const userId = req.id;
  try {
    if (!id) return apiResponse.notFoundResponse(res, "Id not found");
    const image = await imageService.findById({ _id: id });
    if (!image) return apiResponse.notFoundResponse(res, "Image not found");

    const imagePath = path.join(__dirname, "../../uploads", image.filename);
    fs.unlinkSync(imagePath);
    const session = await mongoose.startSession();
    session.startTransaction();
    await Promise.all([
      imageService.deleteById({ _id: id }),
      userService.updateById(userId, { $unset: { avatarId: id } }),
    ]);
    await session.commitTransaction();
    session.endSession();
    return apiResponse.successResponse(res, "Image deleted successfully");
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

module.exports = {
  uploadAvatar,
  deleteAvatar,
  changeAvatar,
};
