const express = require("express");
const ConfigMongo = require("./src/config/mongo.config");
const routes = require("./src/routes")
const app = express();

ConfigMongo.connectDatabase();

app.use("/", routes)

app.listen(3000, () => {
  console.log("listening on port 3000");
});


