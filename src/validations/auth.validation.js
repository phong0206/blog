const { Joi } = require("express-validation");
const SORT_BY_USER = [
  "name:desc",
  "name:asc",
  "age:desc",
  "age:asc",
  "createdAt:desc",
  "createdAt:asc",
];
const SORT_BY_BLOG = ["createdAt:desc", "createdAt:asc"];
exports.login = {
  body: Joi.object().keys({
    email: Joi.string().min(3).email().required(),
    password: Joi.string().min(6).required(),
  }),
};

exports.register = {
  body: Joi.object().keys({
    email: Joi.string().min(3).email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(3),
    isAdmin: Joi.boolean(),
    phonenumber: Joi.string(),
    age: Joi.number().min(6).max(20),
  }),
};

exports.getAllUser = {
  query: Joi.object()
    .keys({
      currentPage: Joi.number().min(1),
      limit: Joi.number().min(0),
      name: Joi.string().allow(""),
      age: Joi.number().min(6).max(100),
      sort: Joi.string()
        .valid(...SORT_BY_USER)
        .allow(""),
    })
};

exports.getAllBlog = {
  query: Joi.object()
    .keys({
      currentPage: Joi.number().min(1),
      limit: Joi.number().min(0),
      title: Joi.string().allow(""),
      content: Joi.string().allow(""),
      author: Joi.string().allow(""),
      sort: Joi.string()
        .valid(...SORT_BY_BLOG)
        .allow(""),
    })
};
