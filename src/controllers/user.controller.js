const bcrypt = require("bcryptjs");
const { userService, userConnectionService } = require("../services");
const { hashData, compareData } = require("../utils/password.util");
const {
  generateAccessToken,
  generateVerifyToken,
  verifyToken,
} = require("../utils/token.util");
const { faker } = require("@faker-js/faker");
const { getAllData } = require("../utils/query.util");
const { User } = require("../models");
const apiResponse = require("../utils/apiResponse");
const _ = require("lodash");
const { sendMail } = require("../utils/mailer.util");
const config = require("../config/config");

const register = async (req, res) => {
  const data = { ...req.body };
  const encryptPass = hashData(data.password);
  const registerUser = {
    name: data.name,
    email: data.email,
    password: encryptPass,
  };
  try {
    const [user] = await Promise.all([
      userService.findOneByEmail(data.email),
      userService.create(registerUser),
    ]);
    if (user) return apiResponse.notFoundResponse(res, "Email already exists");
    const cookieToken = generateVerifyToken(registerUser);
    res.cookie("temp_data", cookieToken, {
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
    });
    const toEmail = `${config.APP_URL}/user/auth/verify`;

    sendMail(data.email, "Register verify", "../views/sendMail", {
      name: data.name,
      verificationLink: toEmail,
    });

    return apiResponse.successResponse(
      res,
      "User account created. Please check your email for verification."
    );
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const verifyRegister = async (req, res) => {
  const cookieToken = req.cookies.temp_data;
  const userData = verifyToken(cookieToken, config.VERIFY_TOKEN_SECRET);
  try {
    if (!userData) return apiResponse.notFoundResponse(res, "Forbidden");
    await userService.findOneAndUpdate(
      { email: userData.data.email },
      {
        verified: true,
      }
    );
    return apiResponse.successResponse(res, "Verified successfully");
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const supplyNewPassword = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await userService.findOneByEmail(email);
    if (!user) return apiResponse.notFoundResponse(res, "User not found");
    const dataEncode = {
      name: user.name,
      email: user.email,
    };
    const cookieToken = generateVerifyToken(dataEncode);
    res.cookie("data", cookieToken, {
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
    });
    const toEmail = `${config.APP_URL}/user/auth/get-new-password`;

    sendMail(email, "Supply A New Password", "../views/supplyNewPassword", {
      name: user.name,
      verificationLink: toEmail,
    });
    return apiResponse.successResponse(
      res,
      "Please check your email for supply new password."
    );
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const getNewPassword = async (req, res) => {
  const cookieToken = req.cookies.data;
  const userData = verifyToken(cookieToken, config.VERIFY_TOKEN_SECRET);
  try {
    if (!userData) return apiResponse.notFoundResponse(res, "Forbidden");
    const newPassword = faker.internet.password();
    await userService.findOneAndUpdate(
      { email: userData.data.email },
      { password: hashData(newPassword) }
    );
    sendMail(
      userData.data.email,
      "Get A New Password",
      "../views/getNewPassword",
      {
        name: userData.data.name,
        newPassword: newPassword,
      }
    );
    res.clearCookie("data");

    return apiResponse.successResponse(
      res,
      "Supply password updated successfully"
    );
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};
const login = async (req, res) => {
  const data = { ...req.body };
  try {
    const user = await userService.findOneByEmail(data.email);
    if (_.isNil(user))
      return apiResponse.notFoundResponse(res, "Email not found");
    const passwordIsValid = compareData(data.password, user.password);
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
  } catch (err) {}
};

const addFriend = async (req, res, next) => {
  const id = req.params.id;

  try {
    const [addUser, userConnection] = await Promise.all([
      userService.findOneById(id),
      userConnectionService.findOneByField({
        from_user: req.id,
        to_user: id,
      }),
    ]);

    if (userConnection)
      return apiResponse.ErrorResponse(res, "request already exists");

    if (!addUser) return apiResponse.notFoundResponse(res, "User not found");

    await userConnectionService.create({
      from_user: req.id,
      to_user: id,
      status: "pending",
    });
    await userService.upsertData({ _id: req.id }, { friends: id });

    return apiResponse.successResponse(res, "Successfully added friend");
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const unFriendOrRevokeFrReq = async (req, res, next) => {
  const id = req.params.id;
  try {
    const request = await userConnectionService.findOneByField({ to_user: id });
    if (!request)
      return apiResponse.notFoundResponse(res, "friend request do not exist");
    await userConnectionService.findOneAndDelete({ to_user: id });
    return apiResponse.successResponse(
      res,
      "unfriend or revoke friend request successfully"
    );
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

const createUser = async (req, res, next) => {
  const newUser = req.body;
  newUser.password = hashPassword(newUser.password);
  try {
    const [isUser] = await Promise.all([
      userService.findOneByEmail(newUser.email),
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
  const id = req.id;
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
  const numberFakeUser = req.query.numberUser;
  try {
    const arrNewUser = [];
    for (let i = 0; i < numberFakeUser; i++) {
      const newUser = new User();
      newUser.email = faker.internet.email();
      password = faker.internet.password();
      newUser.password = bcrypt.hashSync(password, 10);
      newUser.age = faker.number.int({ min: 10, max: 60 });
      newUser.name = faker.person.fullName({ min: 3 });
      newUser.phonenumber = faker.phone.imei();
      arrNewUser.push(newUser);

      console.log(newUser.email);
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
  verifyRegister,
  supplyNewPassword,
  getNewPassword,
  addFriend,
  unFriendOrRevokeFrReq,
};
