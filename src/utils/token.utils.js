const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { saveRefreshTokenToUser } = require("../services/user.service");
exports.generateAccessToken = (id) => {
  try {
    return jwt.sign(
      {
        id: id,
      },
      config.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" },
      { algorithm: "RS256" }
    );
  } catch (err) {
    console.error("Error generating token:", err);
  }
};

exports.verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    console.error("Error verifying token:", err);
  }
};
