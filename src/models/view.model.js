const mongoose = require("mongoose");

const View = mongoose.Schema(
  {
    viewAmount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    blogId: { type: mongoose.Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("view", View);
