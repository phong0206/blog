const jwt = require("jwt");
const config = require("../config/config");
const generateToken = (id, username, secret) => {
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

const verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    console.error("Error verifying token:", error);
  }
};
