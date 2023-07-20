const mongoose = require("mongoose");

const Image = mongoose.Schema(
  {
    filename: {
      type: String,
    },
    path: {
      type: String,
    },
    size: {
      type: String,
    },
    originalname: { type: String },
    mimetype: { type: String },
  },
  {
    timestamps: true,
  }
);
Image.statics.protectedFields = ["_id", "__v"];

module.exports = mongoose.model("Image", Image);
