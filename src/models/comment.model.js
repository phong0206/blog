const mongoose = require("mongoose");

const Comment = mongoose.Schema(
  {
    id_blog: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    id_user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
Comment.statics.protectedFields = ["_id", "__v"];

module.exports = mongoose.model("Comment", Comment);
