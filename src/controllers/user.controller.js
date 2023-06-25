const bcrypt = require("bcryptjs");
const { userService } = require("../services");
const { hashPassword, comparePassword } = require("../utils/password.utils");
const { generateToken, verifyToken } = require("../utils/token.utils");
const register = async (req, res) => {
  try {
    const data = { ...req.body };
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
    const { authorization } = req.headers;

    const data = { ...req.body };
    const user = await userService.findOneByUsername(data.username);
    if (!user) return res.status(404).send("User not found");
    const passwordIsValid = comparePassword(data.password, user.password);
    if (!passwordIsValid) return res.status(401).send("Password is not valid");
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    const token = await generateToken(user._id);
    return res.status(200).send({ token: token, profile: userWithoutPassword });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const getListUsers = async (req, res) => {
  try {
    const sort = {};
    const query = req.query;
    query.sort = query.sort
      ? Array.isArray(query.sort)
        ? query.sort
        : [query.sort]
      : [];
    if (query.sort) {
      const parts = query.sort.flatMap((str) => str.split(":"));
      for (let i = 0; i < parts.length; i += 2) {
        sort[parts[i]] = parts[i + 1];
      }
      const response = await userService.findAll(sort);
      return res.status(200).send({
        message: "Get all users success",
        data: response ?? [],
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const getProfile = (req, res) => {
  return res.status(200).send({ message: "success", profile: req.user });
};
module.exports = {
  register,
  login,
  getListUsers,
  getProfile,
};
