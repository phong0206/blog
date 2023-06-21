const Joi = require("@hapi/joi");
const { authValidation } = require("../validations/index");

const validateUser = (req, res, next) => {
  const { error } = authValidation.authValidation.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

module.exports = validateUser;
