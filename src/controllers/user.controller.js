const bcrypt = require("bcryptjs");
const { userService } = require("../services");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const { hashPassword, comparePassword } = require("../utils/password.utils");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/token.utils");
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
    const data = { ...req.body };
    const user = await userService.findOneByUsername(data.username);
    if (!user) return res.status(404).send("User not found");
    const passwordIsValid = comparePassword(data.password, user.password);
    if (!passwordIsValid) return res.status(401).send("Password is not valid");
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    return res.status(200).send({
      token: { accessToken, refreshToken },
      profile: userWithoutPassword,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  const userId = req.user._id;
  userService
    .removeRefreshTokenFromUser(userId)
    .then(() => {
      res.status(200).send({ message: "logout success" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    });
}

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

const getProfile = async (req, res) => {
  return res.status(200).send({ message: "success", profile: req.user });
};

const userRefreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ message: "Refresh token is required." });
  const user = await userService.findUserByRefreshToken(refreshToken);
  if (!user) return res.sendStatus(403);
  try {
    jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken(decoded.id);
      res.json(accessToken);
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid refresh token." });
  }
};

module.exports = {
  register,
  login,
  getListUsers,
  getProfile,
  userRefreshToken,
  logout,
};
