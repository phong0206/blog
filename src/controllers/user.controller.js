const bcrypt = require("bcryptjs");
const { userService } = require("../services");
const { hashPassword, comparePassword } = require("../utils/password.utils");
const { generateAccessToken } = require("../utils/token.utils");
const { faker } = require("@faker-js/faker");
const { getAllData } = require("../utils/query.utils");
const { User } = require("../models");
const apiResponse = require("../utils/apiResponse");

const register = async (req, res) => {
  try {
    const data = { ...req.body };
    const user = await userService.findOneByUsername(data.username);
    if (user) {
      return apiResponse.notFoundResponse(res, "User already exists");
    }
    data.password = hashPassword(data.password);
    await userService.create(data);
    return apiResponse.successResponse(res, "User created successfully");
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const login = async (req, res) => {
  try {
    const data = { ...req.body };
    const user = await userService.findOneByUsername(data.username);
    if (!user) return apiResponse.notFoundResponse(res, "User not found");
    const passwordIsValid = comparePassword(data.password, user.password);
    if (!passwordIsValid)
      return apiResponse.validationErrorWithData(
        res,
        "Invalid password provided"
      );
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    const accessToken = await generateAccessToken(user._id);
    return apiResponse.successResponseWithData(res, "login successfully", {
      accessToken: accessToken,
      profile: userWithoutPassword,
    });
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const deleteAllUsers = async (req, res, next) => {
  try {
    await userService.deleteAllUsers();
    return apiResponse.successResponse(res, "Successfully deleted all users");
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const createUser = async (req, res, next) => {
  try {
    const newUser = req.body;
    const isUser = await userService.findOneByUsername(newUser.username);
    if (isUser) return apiResponse.notFoundResponse(res, "User not found");
    newUser.password = hashPassword(newUser.password);
    await userService.create(newUser);
    return apiResponse.successResponseWithData(res, "created successfully", {
      profile: newUser,
    });
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const isId = await userService.findOneById(id);
    if (!isId) {
      return apiResponse.notFoundResponse(res, "User not found");
    }
    await userService.updateById(id, data);
    return apiResponse.successResponse(res, "User updated successfully");
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isId = await userService.findOneById(id);
    if (!isId) {
      return apiResponse.notFoundResponse(res, "User not found");
    }
    await userService.deleteById(id);
    return apiResponse.successResponse(res, "User deleted successfully");
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const getListUsers = async (req, res, next) => {
  try {
    const data = await getAllData(req, res, userService);
    return apiResponse.successResponseWithData(
      res,
      "get all users successfully",
      {
        page: data.currentPage,
        limit: data.limit,
        totalPages: data.totalPages,
        users: data.data,
      }
    );
  } catch (error) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const getProfile = async (req, res) => {
  const user = req.user;
  const userWithoutPassword = { ...user._doc };
  delete userWithoutPassword.password;
  return apiResponse.successResponseWithData(
    res,
    "get profile successfully",
    userWithoutPassword
  );
};

const fakeUser = async (req, res) => {
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
    return apiResponse.successResponse(res, "success");
  } catch (e) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
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
