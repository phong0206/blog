const jwt = require("jsonwebtoken");
const config = require("../config/config");
exports.generateToken = (id) => {
  try {
    const payload = {
      id: id,
    };
    console.log(payload);
    return jwt.sign(
      payload,
      config.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
      { algorithm: "RS256" }
    );
  } catch (err) {
    console.error("Error generating token:", error);
  }
};

exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (err) {
    console.error("Error verifying token:", error);
  }
};
