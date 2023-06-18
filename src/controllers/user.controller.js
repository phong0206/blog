const db = require("../models");
const user = db.user;
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
