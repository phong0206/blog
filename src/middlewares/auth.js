const config = require("../config/config");
const { findOneById, findOneByUsername } = require("../services/user.service");
const { verifyToken } = require("../utils/token.utils");
exports.auth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(403).send({ message: "Token not found." });
  }
  try {
    const token = authorization.split(" ")[1];
    const { id } = await verifyToken(token);
    if (!id) {
      return res.status(403).send({ message: "User ID not found in token." });
    }
    req.id = id;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).send({ message: error.message });
  }
};
