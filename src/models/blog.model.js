const mongoose = require("mongoose");

const Blog = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId },
    view: { type: Number },
    imageId: { type: [String] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", Blog);
