const mongoose = require("mongoose");
const User = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      alphanumeric: true,
      default: "admin123",
    },
    avatarId: { type: String },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      required: true,
      default: "admin123",
    },
    name: {
      type: String,
      minlength: [6, "Name must be at least 6 characters long"],
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", User);
