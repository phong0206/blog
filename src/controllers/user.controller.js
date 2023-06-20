const bcrypt = require("bcryptjs");
const { userService } = require("../services");
const { passwordUtils } = require("../utils");
const register = async (req, res) => {
  try {
    const data = { ...req.body };

    if (!data.username || !data.password) {
      return res.status(400).send("Username or password is not valid");
    }

    if (data.password.length < 6 || data.username.length < 3) {
      return res.status(400).send("Password or username is too short");
    }

    const user = await userService.findOneByUsername(data.username);
    if (user) {
      return res.status(400).send("User already exists");
    }

    data.password = passwordUtils.hashPassword(data.password);

    await userService.create(data);
    return res.status(200).send("User was created successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const data = { ...req.body };
    const user = await userService.findOneByUsername(data.username);
    if (!user) return res.status(404).send("User not found");
    const passwordIsValid = passwordUtils.comparePassword(
      data.password,
      user.password
    );
    if (!passwordIsValid) return res.status(401).send("Password is not valid");
    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
};
