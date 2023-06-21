const Joi = require("@hapi/joi");

const authValidation = Joi.object().keys({
  username: Joi.string().min(6).max(20).required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  authValidation,
};
