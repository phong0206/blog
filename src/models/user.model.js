const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Email is not valid",
      },
    },
    avatarId: { type: String },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      required: [true, "Please provide password"],
      default: "admin123",
    },
    name: {
      type: String,
      minlength: [3, "Name must be at least 3 characters long"],
      required: [true, "Please provide name"],
      name: "admin",
    },
    phonenumber: {
      type: String,
    },
    age: {
      type: Number,
      min: [6, "Age must be at least 6"],
      max: 100,
      default: 20,
    },
    isAdmin: { type: Boolean, default: false },
    verified: {
      type: Boolean,
      default: false,
    },
    friends: { type: [String] },
  },
  {
    timestamps: true,
  }
);
User.statics.protectedFields = ["_id", "__v"];

module.exports = mongoose.model("User", User);
