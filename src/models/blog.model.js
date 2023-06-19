const mongoose = require("mongoose");

const Blog = mongoose.model(
  "blog",
  mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
    {
      timestamps: true,
      createAt: "created",
      updateAt: "updated",
    }
  )
);
module.exports = User;
