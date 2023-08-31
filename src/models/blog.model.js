const mongoose = require("mongoose");

const Blog = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide title"],
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    userId: { type: mongoose.Schema.Types.ObjectId },
    author: { type: String, required: true },
    view: { type: Number },
    imageId: { type: [String] },
  },
  {
    timestamps: true,
  }
);
Blog.statics.protectedFields = ["_id", "__v"];
module.exports = mongoose.model("Blog", Blog);
