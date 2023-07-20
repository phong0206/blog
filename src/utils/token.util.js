const jwt = require("jsonwebtoken");
const config = require("../config/config");
exports.generateAccessToken = (id) => {
  try {
    return jwt.sign(
      {
        id: id,
      },
      config.ACCESS_TOKEN_SECRET,
      { expiresIn: "1w" },
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

exports.generateVerifyToken = (email) => {
  try {
    return jwt.sign(
      {
        email: email,
      },
      config.VERIFY_TOKEN_SECRET,
      { expiresIn: "5m" },
      { algorithm: "RS256" }
    );
  } catch (err) {
    console.error("Error generating token:", err);
  }
};
