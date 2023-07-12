const fs = require("fs");
const path = require("path");
const apiResponse = require("../utils/apiResponse");
const { Image } = require("../models");
const mongoose = require("mongoose");

const { imageService, userService } = require("../services");

const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    if (req.file) {
      const data = { ...req.file };
      if (!data) return apiResponse.notFoundResponse(res, "image not found");
      const session = await mongoose.startSession();
      session.startTransaction();
      const savedImage = await imageService.create(data);
      await userService.updateById(userId, { avatarId: savedImage._id });
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
const uploadPhotos = async (req, res) => {
  try {
    const files = req.files;
    const photos = [];
    const userId = req.user.id;
    const arrUserIds = [];
    if (files) {
      for (const file of files) {
        photos.push(file);
      }
      const savedImage = await imageService.insertMany(photos);
      console.log(userId);
      for (const img of savedImage) {
        arrUserIds.push(img._id);
      }
      await userService.updateById(userId, { $push: { imageId: arrUserIds } });
      return apiResponse.successResponseWithData(
        res,
        "uploaded photos successfully",
        savedImage
      );
    } else {
      return apiResponse.notFoundResponse(res, "Not Found");
    }
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const deleteAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) return apiResponse.notFoundResponse(res, "Id not found");
    const image = await imageService.findById({ _id: id });
    if (!image) return apiResponse.notFoundResponse(res, "Image not found");

    const imagePath = path.join(__dirname, "../../uploads", image.filename);
    console.log(imagePath);
    fs.unlinkSync(imagePath);
    const session = await mongoose.startSession();
    session.startTransaction();
    await imageService.deleteById({ _id: id });
    await userService.updateById(userId, { $unset: { avatarId: id } });
    await session.commitTransaction();
    session.endSession();
    return apiResponse.successResponse(res, "Image deleted successfully");
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const changeAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const imageChange = { ...req.file };
    if (!imageChange)
      return apiResponse.notFoundResponse(res, "image not found");

    //delete in folder
    const image = await imageService.findById({ _id: req.user.avatarId });
    const imagePath = path.join(__dirname, "../../uploads", image.filename);
    console.log(imagePath);
    fs.unlinkSync(imagePath);

    const session = await mongoose.startSession();
    session.startTransaction();

    //delete avatarId
    await userService.updateById(userId, {
      $unset: { avatarId: req.user.avatarId },
    });
    // delete document image
    await imageService.deleteById(req.user.avatarId);

    // upload new avatar
    const data = { ...req.file };
    if (!data) return apiResponse.notFoundResponse(res, "image not found");
    const savedImage = await imageService.create(data);
    await userService.updateById(userId, { avatarId: savedImage._id });
    
    await session.commitTransaction();
    session.endSession();

    return apiResponse.successResponseWithData(
      res,
      "uploaded Successfully",
      savedImage
    );
  } catch (err) {}
};
module.exports = {
  uploadAvatar,
  deleteAvatar,
  uploadPhotos,
  changeAvatar,
};
