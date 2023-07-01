const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.Schema(
  {
    username: {
      type: String,
     
      required: true,
      unique: true,
      alphanumeric: true,
      
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      required: true,
    },
    name: {
      type: String,
      minlength: [6, "Name must be at least 6 characters long"],
    },
    phonenumber: {
      type: String,
    },
    age: { type: Number, min: [6, "Age must be at least 6"], max: 100 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", User);
