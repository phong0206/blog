const bcrypt = require("bcryptjs");
const { userService } = require("../services");
const { hashPassword, comparePassword } = require("../utils/password.utils");
const { generateAccessToken } = require("../utils/token.utils");
const { faker } = require("@faker-js/faker");
const { getAllData } = require("../utils/query.utils");
const { User } = require("../models");
const apiResponse = require("../utils/apiResponse");

const register = async (req, res) => {
  const data = { ...req.body };
  try {
    const user = await userService.findOneByUsername(data.username);
    if (user) return apiResponse.notFoundResponse(res, "User already exists");
    data.password = hashPassword(data.password);
    await userService.create(data);
    return apiResponse.successResponse(res, "User created successfully");
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const login = async (req, res) => {
  const data = { ...req.body };
  try {
    const user = await userService.findOneByUsername(data.username);
    if (!user) return apiResponse.notFoundResponse(res, "User not found");
    const passwordIsValid = comparePassword(data.password, user.password);
    if (!passwordIsValid)
      return apiResponse.validationErrorWithData(
        res,
        "Invalid password provided"
      );

    const accessToken = generateAccessToken(user._id);
    const profile = await userService.findFilter(
      { _id: user._id },
      "-password"
    );
    return apiResponse.successResponseWithData(res, "login successfully", {
      accessToken: accessToken,
      profile: profile,
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
  const newUser = req.body;
  newUser.password = hashPassword(newUser.password);
  try {
    const [isUser, createUser] = await Promise.all([
      userService.findOneByUsername(newUser.username),
      userService.create(newUser),
    ]);
    if (isUser) return apiResponse.notFoundResponse(res, "User already exists");
    return apiResponse.successResponseWithData(res, "created successfully", {
      profile: newUser,
    });
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const [isId] = await Promise.all([
      userService.findOneById(id),
      userService.updateById(id, data),
    ]);
    if (!isId) return apiResponse.notFoundResponse(res, "User not found");
    return apiResponse.successResponse(res, "User updated successfully");
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [isId] = await Promise.all([
      userService.findOneById(id),
      userService.deleteById(id),
    ]);
    if (!isId) return apiResponse.notFoundResponse(res, "User not found");
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
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const data = await userService.findFilter({ _id: userId }, "-password");
    return apiResponse.successResponseWithData(
      res,
      "get profile successfully",
      data
    );
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const fakeUser = async (req, res) => {
  const arrNewUser = [];
  try {
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
  } catch (err) {
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
