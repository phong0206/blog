const jwt = require("jsonwebtoken");
const config = require("../config/config");
exports.generateToken = (id) => {
  try {
    const payload = {
      id: id,
    };
    
    return jwt.sign(
      payload,
      config.ACCESS_TOKEN_SECRET,
      { expiresIn: "3d" },
      { algorithm: "RS256" }
    );
  } catch (err) {
    console.error("Error generating token:", err);
  }
};

exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    // console.log(decoded);
    return decoded;
  } catch (err) {
    console.error("Error verifying token:", err);
  }
};
