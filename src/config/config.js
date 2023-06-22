const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

module.exports = {
  MONGODB_URL: `mongodb://${process.env.HOST}:${process.env.PORT}/${process.env.DB_NAME}`,
  PORT: parseInt(process.env.PORT, 10) || 8080,
  SECRET_KEY: process.env.SECRET_KEY,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};
