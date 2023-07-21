const config = require("../config/config");
const { userService } = require("../services");
const { verifyToken } = require("../utils/token.util");
const apiResponse = require("../utils/apiResponse");
const { generateVerifyToken } = require("../utils/token.util");
const { sendMail } = require("../utils/mailer.util");

exports.auth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) return apiResponse.notFoundResponse(res, "Authorization");
  try {
    const token = authorization.split(" ")[1];

    const { id } = verifyToken(token, config.ACCESS_TOKEN_SECRET);
    if (!id) return apiResponse.notFoundResponse(res, "Invalid token");

    const user = await userService.findOneById(id);
    if (!user || user.verified === false)
      return apiResponse.notFoundResponse(res, "Invalid user");

    req.user = user;
    req.id = id;
    next();
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

exports.authVerifyAccount = async (req, res, next) => {
  const email = req.body.email;
  try {
    const user = await userService.findOneByEmail(email);
    if (user.verified === false) {
      const registerUser = {
        name: user.name,
        email: user.email,
        password: user.password,
      };
      const cookieToken = generateVerifyToken(registerUser);
      res.cookie("temp_data", cookieToken, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      });
      const toEmail = `${config.APP_URL}/user/auth/verify`;
      sendMail(user.email, "Register verify", "../views/sendMail", {
        name: user.name,
        verificationLink: toEmail,
      });
      return apiResponse.notFoundResponse(
        res,
        "Account not verified. Please check mail to verified account!"
      );
    }
    next();
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, err.message);
  }
};

exports.checkAdminAuth = (req, res, next) => {
  if (!req.user) {
    return apiResponse.notFoundResponse(res, "Login Error");
  }
  if (!req.user.isAdmin) {
    return apiResponse.notFoundResponse(res, "Admin Authentication Error");
  }
  next();
};
