const bcrypt = require("bcryptjs");
const { userService } = require("../services");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { hashPassword, comparePassword } = require("../utils/password.utils");
const { generateAccessToken, verifyToken } = require("../utils/token.utils");
const { faker } = require("@faker-js/faker");
const { User } = require("../models");
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
    return res.status(200).send({
      token: { accessToken },
      profile: userWithoutPassword,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const deleteAllUsers = async (req, res, next) => {
  try {
    await User.deleteMany({});
    console.log("Đã xóa tất cả người dùng thành công.");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const getListUsers = async (req, res, next) => {
  const usersPerPage = req.query.limit; // number of users displayed on one page
  let currentPage = req.query.currentPage || 1;

  try {
    const sort = parseSortQuery(req.query.sort);
    const filteredUsers = await parseFindQuery(req);
    console.log(filteredUsers);
    const totalCount = await User.countDocuments(); // get total count of users
    const totalPages = Math.ceil(totalCount / usersPerPage);
    if (currentPage < 1 || currentPage > totalPages) {
      return res.status(400).send("Invalid page");
    }

    const skipUsers = usersPerPage * (currentPage - 1); // calculate number of users to skip
    const users = await userService.findAll(
      filteredUsers,
      sort,
      skipUsers,
      usersPerPage
    );

    res.send({
      page: currentPage,
      limit: usersPerPage,
      totalPages,
      users,
    });
  } catch (error) {
    next(error);
  }
};

const parseFindQuery = async (req, res) => {
  try {
    const { name, age, username } = req.query;

    const lowercaseName = name ? name.toLowerCase() : "";
    const query = {};

    if (lowercaseName) {
      query.name = { $regex: lowercaseName, $options: "i" };
    }

    if (age) {
      query.age = {};

      if (req.query.age.lt) {
        query.age.$lt = parseInt(req.query.age.lt);
      }

      if (req.query.age.gt) {
        query.age.$gt = parseInt(req.query.age.gt);
      }

      if (req.query.age.gte) {
        query.age.$gte = parseInt(req.query.age.gte);
      }

      if (req.query.age.lte) {
        query.age.$lte = parseInt(req.query.age.lte);
      }

      if (req.query.age.ne) {
        query.age.$ne = parseInt(req.query.age.ne);
      }
    }

    if (username) {
      query.username = username;
    }

    return query;
  } catch (error) {
    console.error("Error finding users:", error);
    throw error; // Propagate the error to the caller
  }
};

const parseSortQuery = (sortQuery) => {
  const sort = {};

  if (sortQuery) {
    const sortKeys = Array.isArray(sortQuery) ? sortQuery : [sortQuery];

    sortKeys.forEach((key) => {
      const [field, order] = key.split(":");
      sort[field] = order || 1;
    });
  }

  return sort;
};

const getProfile = async (req, res) => {
  return res.status(200).send({ message: "success", profile: req.user });
};

const fakeUser = async (req, res) => {
  for (let i = 0; i < 50; i++) {
    const newUser = new User();
    newUser.username = faker.internet.userName();
    password = faker.internet.password();
    newUser.password = bcrypt.hashSync(password, 10);
    newUser.age = faker.number.int({ min: 10, max: 60 });
    newUser.name = faker.person.fullName({ min: 3 });
    newUser.phonenumber = faker.phone.imei();
    console.log(newUser);
    User.create(newUser);
  }
};
module.exports = {
  register,
  login,
  getListUsers,
  getProfile,
  fakeUser,
  deleteAllUsers,
};
