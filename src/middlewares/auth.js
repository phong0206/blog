const config = require("../config/config");
const { userService } = require("../services");
const { verifyToken } = require("../utils/token.util");
const apiResponse = require("../utils/apiResponse");
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
  const email = req.body.email
  try {
    const user = await userService.findOneByEmail(email);
    if (user.verified === false) return apiResponse.notFoundResponse(res, "User not verified");
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
