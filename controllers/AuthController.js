var { Users } = require("../models/Users");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const utility = require("../helpers/utility");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const secret = process.env.JWT_SECRET;
const secret =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
exports.register = [
  body("fullname").isLength({ min: 1 }),
  body("designation").isLength({ min: 0 }),
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("mobile").isLength({ min: 5 }),
  async (req, res) => {
    console.log(req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        // first check if user already exists

        const user = await Users.findOne({
          email: req.body.email,
          mobile: req.body.mobile,
        });
        if (user) {
          return apiResponse.validationErrorWithData(
            res,
            "User already exists with this email or phone",
            errors.array()
          );
        }

        bcrypt.hash(req.body.password, 10, function (err, hash) {
          var usr = new Users({
            fullname: req.body.fullname,
            designation: req.body.designation,
            organization: req.body.organization,
            fathername: req.body.fathername,
            password: hash,
            mobile: req.body.mobile,
            email: req.body.email,
            aadhar: req.body.aadhar,
            dateofbirth: req.body.dateofbirth,
          });
          usr.save(function (err) {
            if (err) {
              return apiResponse.errorResponse(res, err);
            }
            let userData = {
              _id: usr._id,
              fullname: usr.fullname,
              designation: usr.designation,
              organization: usr.organization,
              fathername: usr.fathername,
              mobile: usr.mobile,
              email: usr.email,
              aadhar: usr.aadhar,
              dateofbirth: usr.dateofbirth,
            };
            return apiResponse.successResponseWithData(
              res,
              "Registration Success.",
              userData
            );
          });
        });
      }
    } catch (err) {
      console.log("Coming heereerree.");
      apiResponse.errorResponse(res, err);
    }
  },
];

exports.login = [
  body("email").isLength({ min: 1 }).isEmail(),
  body("password").isLength({ min: 5 }),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        Users.findOne({ email: req.body.email }).then((user) => {
          if (user) {
            bcrypt.compare(
              req.body.password,
              user.password,
              function (err, same) {
                if (same) {
                  if (user.active) {
                    let userData = {
                      _id: user._id,
                      name: user.fullname,
                      email: user.email,
                      designation: user.designation,
                      organization: user.organization,
                      fathername: user.fathername,
                      mobile: user.mobile,
                      email: user.email,
                      aadhar: user.aadhar,
                      dateofbirth: user.dateofbirth,
                    };
                    const jwtPayload = userData;
                    const jwtData = {
                      expiresIn: process.env.JWT_TIMEOUT_DURATION,
                    };
                    const secret = process.env.JWT_SECRET;
                    userData.token = jwt.sign(jwtPayload, secret, jwtData);
                    return apiResponse.successResponseWithData(
                      res,
                      "Login Success.",
                      userData
                    );
                  } else {
                    return apiResponse.unauthorizedResponse(
                      res,
                      "Account is not active. Please contact admin."
                    );
                  }
                } else {
                  return apiResponse.unauthorizedResponse(
                    res,
                    "Password Not Matched."
                  );
                }
              }
            );
          } else {
            return apiResponse.unauthorizedResponse(
              res,
              "Email or Password wrong."
            );
          }
        });
      }
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.profileupdate = [
  body("fullname").isLength({ min: 1 }),
  body("mobile").isLength({ min: 1 }),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        Users.findByIdAndUpdate(req.user._id, req.body, {}, function (err) {
          if (err) {
            return apiResponse.errorResponse(res, err);
          } else {
            return apiResponse.successResponseWithData(
              res,
              "Profile update Success.",
              req.body
            );
          }
        });
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.changePassword = [
  body("password").isLength({ min: 6 }),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          Users.findByIdAndUpdate(
            req.user._id,
            { password: hash },
            {},
            function (err) {
              if (err) {
                return apiResponse.errorResponse(res, err);
              } else {
                return apiResponse.successResponseWithData(
                  res,
                  "Password Changed Successfully.",
                  req.body
                );
              }
            }
          );
        });
      }
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.sendOtp = [
  body("mobile").isLength({ min: 7 }),
  (req, res) => {
    console.log(req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        let otp = utility.randomNumber(4);
        Users.findOneAndUpdate(
          { mobile: req.body.mobile },
          { $set: { otp: otp } },
          function (err, user) {
            if (err) {
              return apiResponse.errorResponse(res, err);
            } else if (!user) {
              return apiResponse.errorResponse(res, "User Not Found");
            }
            return apiResponse.successResponseWithData(
              res,
              "OTP send Successfully.",
              otp
            );
          }
        );
      }
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.validateOtp = [
  body("mobile").isLength({ min: 7 }),
  body("otp").isLength({ min: 4 }),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        Users.findOne({
          mobile: req.body.mobile,
          otp: req.body.otp,
        }).then((user) => {
          if (user && user.otp === req.body.otp) {
            return apiResponse.successResponseWithData(
              res,
              "OTP Validated successfully.",
              user
            );
          }
          return apiResponse.validationErrorWithData(
            res,
            "OTP does not match .",
            []
          );
        });
      }
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
  },
];
exports.forgotPassword = [
  body("email").isLength({ min: 1 }).isEmail(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        Users.findOne(
          { email: req.body.email },
          "fullname mobile email",
          function (err, user) {
            if (err) {
              return apiResponse.unauthorizedResponse(res, "User no found.");
            } else {
              return apiResponse.successResponseWithData(
                res,
                "Data retrieved successfully.",
                user
              );
            }
          }
        );
      }
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.userInfo = [
  (req, res) => {
    try {
      Users.findById(
        req.user._id,
        "fullname designation organization fathername mobile email aadhar dateofbirth createdAt",
        function (err, user) {
          if (err) {
            return apiResponse.unauthorizedResponse(res, "User no found.");
          } else {
            return apiResponse.successResponseWithData(
              res,
              "Data retrieved successfully.",
              user
            );
          }
        }
      );
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.userList = [
  //auth,
  function (req, res) {
    try {
      Users.find()
        .select(
          "fullname designation organization fathername mobile email aadhar dateofbirth createdAt"
        )
        .then((userstatus) => {
          if (userstatus.length > 0) {
            return apiResponse.successResponseWithData(
              res,
              "Data retrieved successfully.",
              userstatus
            );
          } else {
            return apiResponse.successResponseWithData(
              res,
              "No Record Found.",
              []
            );
          }
        });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.authenticateToken = [
  (req, res, next) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    if (token == null) return res.sendStatus(401); // if there isn't any token
    jwt.verify(token, secret, (err, user) => {
      console.log(err);
      if (err) return apiResponse.unauthorizedResponse(res, err);
      req.user = user;
      next(); // pass the execution off to whatever request the client intended
    });
  },
];
