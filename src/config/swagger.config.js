const swaggerJsdoc = require("swagger-jsdoc");
const config = require("./config");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Manager For Users And Blogs",
      version: "1.0.0",
      description: "This is a CRUD API application made with Express and documented with Swagger",
      contact: {
        name: "Phong_202485",
        url: "http://developer.website.com",
        email: "vanphong02062002@gmail.com"
      }
    },
    servers: [
      {
        url: config.APP_URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ["./src/swagger/user.swagger.js", "./src/swagger/blog.swagger.js"],
};
exports.specs = swaggerJsdoc(options);
