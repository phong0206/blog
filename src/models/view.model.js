const mongoose = require("mongoose");

const View = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
    },
    blogId: { type: mongoose.Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  }
);
View.statics.protectedFields = ["_id", "__v"];

module.exports = mongoose.model("View", View);
