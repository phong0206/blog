const mongoose = require("mongoose");

const User = mongoose.model(
  "user",
  mongoose.Schema(
    {
      username: {
        type: String,
        minlength: [6, "Username must be at least 6 characters long"],
        required: true,
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
        validate: {
          validator: (v) => {
            return /((09|03|07|08|05)+([0-9]{8})\b)/g.test(v);
          },
          message: "Phone number is not a valid",
        },
      },
      age: { type: Number, min: [6, "Age must be at least 6"], max: 100 },
    },
    {
      timestamps: true,
      createAt: "created",
      updateAt: "updated",
    }
  )
);
module.exports = User;
