const jwt = require("jwt");
const config = require("../config/config");
exports.generateToken = (id, username, secret) => {
  try {
    const payload = {
      id: id,
      username: username,
    };
    return jwt.sign(
      payload,
      secret,
      { expiresIn: "1d" },
      { algorithm: "RS256" }
    );
  } catch (err) {
    console.error("Error generating token:", error);
  }
};

exports.verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    console.error("Error verifying token:", error);
  }
};
