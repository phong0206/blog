const config = require("../config/config");
const { findOneById } = require("../services/user.service");
const { verifyToken } = require("../utils/token.utils");
exports.auth = async (req, res, next) => {
  const authorization = req.headers["authorization"];
  // console.log(authorization);
  if (!authorization) {
    res.status(403).send({ message: "Token not found." });
  } else {
    try {
      const token = authorization && authorization.split(" ")[1];
      console.log(token);
      const { id } = await verifyToken(token);
      console.log("id: " + id);
      const user = await findOneById(id);
      if (!user) res.status(403).send({ message: "Forbidden" });
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      res.status(403).send({ message: "Forbidden" });
    }
  }
};
