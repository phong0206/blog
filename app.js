const express = require("express");

const app = express();

app.listen(3000, () => {
  console.log("listening on port 3000");
});

require("./src/routes/user.route")(app);
