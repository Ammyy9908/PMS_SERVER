const { WorkSpace } = require("../models/WorkSpace");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var fs = require("fs");
exports.createWorkSpace = [
  body("name").isLength({ min: 2 }),
  body("description").isLength({ min: 12 }),
  body("members").isLength({ min: 1 }),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error .",
          errors.array()
        );
      } else {
        var workspace = new WorkSpace({
          name: req.body.name,
          description: req.body.description,
          createdBy: req.user._id,
        });
        workspace.save(function (err) {
          if (err) {
            return apiResponse.errorResponse(res, err);
          }
          let workSpaceData = {
            _id: workspace._id,
            name: workspace.name,
            description: workspace.description,
            createdBy: workspace.createdBy,
          };
          return apiResponse.successResponseWithData(
            res,
            "Workspace created.",
            workSpaceData
          );
        });
      }
    } catch (err) {
      apiResponse.errorResponse(res, err);
    }
  },
];

exports.fetchWorkSpace = [
  (req, res) => {
    try {
      WorkSpace.find({}, function (err, workspaces) {
        if (err) {
          return apiResponse.errorResponse(res, err);
        }
        return apiResponse.successResponseWithData(
          res,
          "Workspaces fetched.",
          workspaces
        );
      });
    } catch (err) {
      apiResponse.errorResponse(res, err);
    }
  },
];
