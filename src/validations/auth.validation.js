const { Joi } = require("express-validation");

exports.login = {
  body: Joi.object().keys({
    username: Joi.string().min(6).max(20).required(),
    password: Joi.string().min(6).required(),
  }),
};

exports.register = {
  body: Joi.object().keys({
    username: Joi.string().min(6).max(20).required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(3),
    isAdmin: Joi.boolean()
  }),
};
