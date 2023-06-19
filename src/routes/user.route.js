module.exports = (app) => {
  const express = require("express");
  const router = express.Router();

  const { register, login } = require("../controllers/user.controller");

  router.post("/register", register);

  router.post("/login", login);
  app.use(express.json());

  app.use("/user/auth", router);
};
