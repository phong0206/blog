const config = require("../config/config");
const { findOneById } = require("../services/user.service");
const { verifyToken } = require("../utils/token.utils");
exports.auth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(403).send({ message: "Token not found." });
  }
  try {
    const token = authorization.split(" ")[1];
    const { id } = await verifyToken(token, config.ACCESS_TOKEN_SECRET);
    if (!id) {
      return res.status(403).send({ message: "User ID not found in token." });
    }
    const user = await findOneById(id);
    if (!user) {
      return res.status(403).send({ message: "Forbidden" });
    }
    req.user = user;
    req.user.isAdmin = user.isAdmin;

    next();
  } catch (error) {
    console.error(error);
    res.status(403).send({ message: error.message });
  }
};

exports.checkAdminAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Login, please!' });
  }
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "You do not have access" });
  }
  next();
};
