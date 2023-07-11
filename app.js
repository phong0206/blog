const express = require("express");
const ConfigMongo = require("./src/config/mongo.config");
const routes = require("./src/routes");
const swaggerUi = require("swagger-ui-express");
const { specs } = require("./src/config/swagger.config");
const app = express();

ConfigMongo.connectDatabase();
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.json());

app.use("/", routes);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
