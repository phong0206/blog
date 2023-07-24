const mongoose = require("mongoose");

const User_Connection = mongoose.Schema(
  {
    from_user: {
      type: String,
    },
    to_user: {
      type: String,
    },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);
User_Connection.statics.protectedFields = ["_id", "__v"];
module.exports = mongoose.model("User_Connection", User_Connection);
