const express = require("express");
const ConfigMongo = require("./config/mongo.config");
const routes = require("./routes");
const swaggerUi = require("swagger-ui-express");
const { specs } = require("./config/swagger.config");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const { limiter } = require('./middlewares/rate.limiter.middleware')
const config = require('./config/config')



const app = express();

ConfigMongo.connectDatabase();

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200
};


//set security HTTP headers
app.use(helmet());

app.use(cookieParser());
app.use(cors(corsOptions));

//parse json body params
app.use(express.json());

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

//limit req
app.use(limiter);


app.use("/", routes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));


app.listen(3000, () => {
  console.log("listening on port 3000");
});
