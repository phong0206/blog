const fs = require("fs");
const path = require("path");
const apiResponse = require("../utils/apiResponse");
const { Image } = require("../models");
const upload = async (req, res) => {
  try {
    if (req.file) {
      const data = { ...req.file };
      const savedImage = await Image.create(data);
      return apiResponse.successResponseWithData(
        res,
        "upload Successfully",
        savedImage
      );
    } else {
      return apiResponse.notFoundResponse(res, "image not found");
    }
  } catch (error) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};
const uploadPhotos = async (req, res) => {
  try {
    const files = req.files;
    const photos = [];
    if (files) {
      for (const file of files) {
        photos.push(file);
      }
      const savedImage = await Image.insertMany(photos);
      res.json(savedImage);
    } else {
      return apiResponse.notFoundResponse(res, "Not Found");
    }
  } catch (error) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const deleteAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return apiResponse.notFoundResponse(res, "Id not found");
    const image = await Image.findById({ _id: id });
    if (!image) return apiResponse.notFoundResponse(res, "Image not found");
    const imagePath = path.join(__dirname, "../../uploads", image.filename);
    console.log(imagePath);
    fs.unlinkSync(imagePath);
    await Image.findByIdAndDelete({ _id: id });
    return apiResponse.successResponse(res, "Image deleted successfully");
  } catch (error) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

module.exports = {
  upload,
  deleteAvatar,
  uploadPhotos,
};
