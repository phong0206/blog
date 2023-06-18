const mongoose = require("mongoose");
const config = require("./config");

console.log(config.MONGODB_URL);

let countRetry = 0;

exports.connectDatabase = async () => {
  mongoose.Promise = global.Promise;
  try {
    await mongoose
      .connect(config.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Successfully connect to MongoDB.");
      })
      .catch((err) => {
        console.error("Connection error", err);
        process.exit();
      });
    countRetry = 0;
  } catch (err) {
    console.log(error);
    countRetry += 1;
    console.log(
      `Could not connect to the mongo database. Retry times: ${countRetry}`
    );
    if (countRetry < 4) {
      setTimeout(this.connectDatabase, 3000);
    } else {
      process.exit();
    }
  }
};
