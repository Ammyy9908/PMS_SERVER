var { Users } = require("../models/Users");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const utility = require("../helpers/utility");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../helpers/mailer");
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

exports.changeWorkSpace = [
  async (req, res) => {
    try {
      const updated = await Users.updateOne(
        { _id: req.user._id },
        { activeWorkSpace: req.body.workspace }
      );
      if (updated) {
        apiResponse.successResponse(res, "Workplace switched");
      }
    } catch (e) {
      apiResponse.errorResponse(res, e);
    }
  },
];

exports.sendOtp = [
  body("email").isLength({ min: 7 }),
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
        let otp = utility.randomNumber(4);
        Users.updateOne(
          { email: req.body.email },
          { $set: { otp: otp } },
          async function (err, user) {
            if (err) {
              return apiResponse.errorResponse(res, err);
            } else if (!user) {
              return apiResponse.errorResponse(res, "User Not Found");
            }

            await sendMail({
              subject: "DK Task Verification",
              to: req.body.email,
              template: `<h1>Welcome to Dk Tasks</h1>
            <p>Your OTP for verification is ${otp}</p>
            `,
              message:
                "Welcome to DK Tasks\n Your OTP for verification is " + otp,
            });

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
  body("email").isLength({ min: 7 }),
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
          email: req.body.email,
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
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        //first find the user
        const user = await Users.findOne({ email: req.email });

        if (!user) {
          return apiResponse.errorResponse(res, "Unauthorized");
        }

        // update the password with encrypted password

        const hashed = await bcrypt.hashSync(req.body.password, 10);

        const updated = await Users.updateOne(
          { _id: req, user, id },
          { password: hashed }
        );
        if (updated) {
          return apiResponse.successResponse(
            res,
            "Password successfully changed"
          );
        }
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

exports.getProfile = [
  async (req, res) => {
    const { id } = req.params;
    try {
      const user = await Users.findOne({ _id: id });
      return apiResponse.successResponseWithData(res, "User found", user);
    } catch (e) {
      return apiResponse.errorResponse(res, e.message);
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
  async (req, res, next) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401); // if there isn't any token
    jwt.verify(token, secret, async (err, user) => {
      if (err) return apiResponse.unauthorizedResponse(res, err);

      const u = await Users.findOne({ _id: user._id });
      req.user = u;
      next(); // pass the execution off to whatever request the client intended
    });
  },
];
