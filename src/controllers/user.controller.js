const bcrypt = require("bcryptjs");
const { userService } = require("../services");
const { hashPassword, comparePassword } = require("../utils/password.utils");
const { generateAccessToken } = require("../utils/token.utils");
const { faker } = require("@faker-js/faker");
const { parseFindQueryUser, parseSortQuery } = require("../utils/query.utils");

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

const deleteAllUsers = async (res, next) => {
  try {
    await userService.deleteAllUsers();
    return res
      .status(200)
      .json({ message: "Successfully deleted all users successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res, next) => {
  try {
    const newUser = req.body;
    const isUser = await userService.findOneByUsername(newUser.username);
    if (isUser) return res.status(400).send({ message: "User does exist" });
    newUser.password = hashPassword(newUser.password);
    userService.create(newUser);
    return res
      .status(200)
      .json({ message: "User created successfully", profile: newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const isId = await userService.findOneById(id);
    if (!isId) {
      return res.status(400).send({ message: "User does not exist" });
    }
    await userService.updateById(id, data);
    return res.status(200).send({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isId = await userService.findOneById(id);
    if (!isId) {
      return res.status(400).send({ message: "User does not exist" });
    }
    await userService.deleteById(id);
    return res.status(200).send({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const getListUsers = async (req, res, next) => {
  const usersPerPage = req.query.limit;
  let currentPage = req.query.currentPage || 1;
  try {
    const sort = parseSortQuery(req.query.sort);
    const filteredUsers = parseFindQueryUser(req);
    const totalCount = await userService.countDocuments();
    const totalPages = Math.ceil(totalCount / usersPerPage);
    if (currentPage < 1 || currentPage > totalPages) {
      return res.status(400).send("Invalid page");
    }
    const skipUsers = usersPerPage * (currentPage - 1);
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

const getProfile = async (req, res) => {
  const user = req.user;
  const userWithoutPassword = { ...user._doc };
  delete userWithoutPassword.password;
  return res
    .status(200)
    .send({ message: "success", profile: userWithoutPassword });
};

const fakeUser = async (res) => {
  try {
    const arrNewUser = [];
    for (let i = 0; i < 30; i++) {
      const newUser = new User();
      newUser.username = faker.internet.userName();
      password = faker.internet.password();
      newUser.password = bcrypt.hashSync(password, 10);
      newUser.age = faker.number.int({ min: 10, max: 60 });
      newUser.name = faker.person.fullName({ min: 3 });
      newUser.phonenumber = faker.phone.imei();
      arrNewUser.push(newUser);
    }
    await userService.insertMany(arrNewUser);
    return res.status(200).send("success");
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};
module.exports = {
  register,
  login,
  getListUsers,
  getProfile,
  fakeUser,
  deleteAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
