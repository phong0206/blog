const express = require("express");
const ConfigMongo = require("./src/config/mongo.config");
const app = express();


ConfigMongo.connectDatabase();

app.listen(3000, () => {
  console.log("listening on port 3000");
});

require("./src/routes/user.route")(app);
