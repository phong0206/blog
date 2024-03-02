exports.successResponse = function (res, msg) {
  var data = {
    status: 200,
    message: msg,
  };
  return res.status(200).json(data);
};

exports.successResponseWithData = function (res, msg, data) {
  var resData = {
    status: 200,
    message: msg,
    data: data,
  };
  return res.status(200).json(resData);
};

exports.ErrorResponse = function (res, msg) {
  var data = {
    status: 500,
    message: msg,
  };
  return res.status(200).json(data);
};

exports.notFoundResponse = function (res, msg) {
  var data = {
    status: 400,
    message: msg,
  };
  return res.status(200).json(data);
};

exports.validationErrorWithData = function (res, msg, data) {
  var resData = {
    status: 403,
    message: msg,
    data: data,
  };
  return res.status(200).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
  var data = {
    status: 401,
    message: msg,
  };
  return res.status(200).json(data);
};
