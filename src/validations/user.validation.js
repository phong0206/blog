const Joi = require("@hapi/joi");

const authSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(3).required(),
});

module.exports = {
  authSchema,
};