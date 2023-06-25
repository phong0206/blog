const config = require("../config/config");
const { findOneById, findOneByUsername } = require("../services/user.service");
const { verifyToken } = require("../utils/token.utils");
exports.auth = async (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!authorization) {
    res.status(403).send({ message: "Token not found." });
  } else {
    try {
      const token = authorization && authorization.split(" ")[1];
      const { id } = await verifyToken(token);
      console.log(id);
      const user = await findOneById(id);
      console.log(user);
      if (!user) res.status(403).send({ message: "Forbidden" });
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      res.status(403).send({ message: "Forbidden" });
    }
  }
};
