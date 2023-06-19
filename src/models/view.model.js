const mongoose = require("mongoose");

const View = mongoose.model(
  "view",
  mongoose.Schema(
    {
      viewAmount: {
        type: Number,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      blogId: { type: mongoose.Schema.Types.ObjectId, ref: "blog" },
    },
    {
      timestamps: true,
      createdAt: "created",
      updatedAt: "updated",
    }
  )
);

module.exports = View;
