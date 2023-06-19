const bcrypt = require("bcryptjs");
const { userService } = require("../services");
const { User } = require("../models");

const register = async (req, res) => {
  try {
    const data = req.body;

    if (!data.username || !data.password) {
      return res.status(400).send("Username or password is not valid");
    }

    if (data.password.length <= 6 || data.username.length <= 3) {
      return res.status(400).send("Password or username is too short");
    }

    const user = await User.findOne({ username: data.username });
    if (user) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new User({
      username: data.username,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(200).send("User was created successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const login = (req, res) => {};

module.exports = {
  register,
  login,
};
