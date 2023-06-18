const db = require("../models");
const users = db.user;
const bcrypt = require("bcryptjs");
const userServices = require("../services");

const createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password)
      return res.status(400).send("Invalid username or password");
    if (user) return res.status(400).send("user already exists");
    const hashedPassword = bcrypt.hash(data.password, 10);
    const user = await userServices.findOne(username);
    password = hashedPassword;
    await user.create(req.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const getAllUser = (req, res) => {
  return res.status(200).json(users);
};

const getUser = (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  return res.status(200).json(user);
};

const updateUser = (req, res) => {
  const id = req.params.id;
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return res.status(404).send("User not found");
  }
  const updatedInfoUser = {
    name: req.body.name,
    phonenumber: req.body.phonenumber,
    birthday: req.body.birthday,
  };
  users[index] = updatedInfoUser;
  return res.status(200).json(updatedInfoUser);
};
const deleteUser = (req, res) => {
  const id = req.params.id;
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return res.status(404).send("User not found");
  }
  users.splice(index, 1);
  res.status(200).json("Users deleted");
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUser,
};
