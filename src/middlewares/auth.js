const config = require("../config/config");
const { findOneById } = require("../services/user.service");
const { verifyToken } = require("../utils/token.utils");
const apiResponse = require("../utils/apiResponse");
exports.auth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return apiResponse.notFoundResponse(res, "Authorization");
  }
  try {
    const token = authorization.split(" ")[1];
    const { id } = await verifyToken(token, config.ACCESS_TOKEN_SECRET);
    if (!id) {
      return apiResponse.notFoundResponse(res, "Invalid token");
    }
    const user = await findOneById(id);
    if (!user) {
      return apiResponse.notFoundResponse(res, "Invalid user");
    }
    req.user = user;
    req.user.isAdmin = user.isAdmin;

    next();
  } catch (error) {
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
