const jwt = require("jsonwebtoken");

exports.successResponse = function (res, msg) {
  var data = {
    // status: true,
    status: "success",
    responsecode: 200,
    message: msg,
  };
  return res.status(200).json(data);
};

exports.successResponseWithData = function (res, msg, data) {
  var resData = {
    // status: true,
    status: "success",
    responsecode: 200,
    message: msg,
    data: data,
  };
  return res.status(200).json(resData);
};
exports.errorResponse = function (res, msg) {
  var data = {
    status: "error",
    responsecode: 500,
    message: msg,
  };
  return res.status(500).json(data);
};

exports.notFoundResponse = function (res, msg) {
  var data = {
    status: "error",
    responsecode: 404,
    message: msg,
  };
  return res.status(404).json(data);
};
exports.validationErrorWithData = function (res, msg, data) {
  var resData = {
    status: "error",
    message: msg,
    responsecode: 400,
    data: data,
  };
  return res.status(400).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
  var data = {
    status: "error",
    responsecode: 401,
    message: msg,
  };
  return res.status(401).json(data);
};
