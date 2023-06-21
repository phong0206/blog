const Joi = require("@hapi/joi");

exports.login = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  password: Joi.string().min(6).required(),
});