module.exports = (app) => {
  const express = require("express");
  const router = express.Router();

  const {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    getAllUser,
  } = require("../controllers/user.controller");

  router.get("/", getAllUser);

  router.get("/:id", getUser);

  router.post("/", createUser);

  router.put("/:id", updateUser);

  router.delete("/:id", deleteUser);
  app.use("/api/users", router);
};
