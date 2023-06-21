const bcrypt = require("bcryptjs");
const { userService } = require("../services");
const { hashPassword, comparePassword } = require("../utils/password.utils");
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
    data.password = hashPassword(data.password);
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
    const passwordIsValid = comparePassword(data.password, user.password);
    if (!passwordIsValid) return res.status(401).send("Password is not valid");
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return res.status(200).send(userWithoutPassword);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const getListUsers = async (req, res) => {
  try {
    const { query } = req;
    const response = await userService.findAll(query);
    return res.status(200).send({
      message: "Get all users success",
      data: response ?? []
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};


module.exports = {
  register,
  login,
  getListUsers,
};
