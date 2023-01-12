var { Tasks } = require("../models/Tasks");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var fs = require("fs");
exports.addTasks = [
  body("taskname").isLength({ min: 2 }),
  body("subject").isLength({ min: 2 }),
  body("description").isLength({ min: 2 }),
  body("followers").isArray(),
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
        var task = new Tasks({
          taskname: req.body.taskname,
          subject: req.body.subject,
          description: req.body.description,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          priority: req.body.priority,
          createdBy: req.user._id,
          followers: req.body.followers,
          leader: req.body.leader,
          beneficiary: req.body.beneficiary,
        });
        task.save(function (err) {
          if (err) {
            return apiResponse.errorResponse(res, err);
          }
          let taskData = {
            _id: task._id,
            taskname: task.taskname,
            subject: task.subject,
            description: task.description,
            startDate: task.startDate,
            endDate: task.endDate,
            followers: req.body.followers,
            leader: req.body.leader,
            beneficiary: req.body.beneficiary,
          };
          return apiResponse.successResponseWithData(
            res,
            "Registration Success.",
            taskData
          );
        });
      }
    } catch (err) {
      apiResponse.errorResponse(res, err);
    }
  },
];

exports.updateTasks = [
  body("taskId").isLength({ min: 10 }),
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
        Tasks.findByIdAndUpdate(
          req.body.taskId,
          {
            taskname: req.body.taskname,
            subject: req.body.subject,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            createdBy: req.user._id,
            followers: req.body.followers,
            leader: req.body.leader,
            beneficiary: req.body.beneficiary,
          },
          {},
          function (err) {
            if (err) {
              return apiResponse.errorResponse(res, err);
            } else {
              return apiResponse.successResponseWithData(
                res,
                "Task update Success.",
                req.body
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

exports.taskInfo = [
  (req, res) => {
    try {
      Tasks.findOne({ _id: req.params.taskid })
        .select(
          "taskname subject description startDate endDate followers leader beneficiary createdBy createdAt"
        )
        .populate("followerslist", "fullname mobile")
        .populate("leaderinfo", "fullname mobile")
        .populate("beneficiaryinfo", "fullname mobile")
        .exec(function (err, data) {
          if (data) {
            return apiResponse.successResponseWithData(
              res,
              "Data retrieved successfully.",
              data
            );
          } else {
            return apiResponse.errorResponse(res, err);
          }
        });
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.taskList = [
  function (req, res) {
    try {
      var perPage = 10,
        page = Math.max(0, req.params.page);
      console.log(req.user._id);
      Tasks.find({ createdBy: req.user._id })
        .select(
          "taskname subject description startDate endDate followers leader beneficiary createdBy createdAt"
        )
        .limit(perPage)
        .skip(perPage * page)
        .sort({ createdAt: "desc" })
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

exports.createdTasks = [
  function (req, res) {
    try {
      var perPage = 10,
        page = Math.max(0, req.params.page);
      Tasks.find({ createdBy: req.user._id })
        .select(
          "taskname subject description startDate endDate followers leader beneficiary createdBy createdAt"
        )
        .limit(perPage)
        .skip(perPage * page)
        .sort({ createdAt: "desc" })
        .populate("followerslist", "fullname mobile")
        .populate("leaderinfo", "fullname mobile")
        .populate("beneficiaryinfo", "fullname mobile")
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

exports.followingTaskList = [
  function (req, res) {
    try {
      var perPage = 10,
        page = Math.max(0, req.params.page);
      Tasks.find({ followers: req.user._id })
        .select(
          "taskname subject description startDate endDate followers leader beneficiary createdBy createdAt"
        )
        .limit(perPage)
        .skip(perPage * page)
        .sort({ createdAt: "desc" })
        .populate("followerslist", "fullname mobile")
        .populate("leaderinfo", "fullname mobile")
        .populate("beneficiaryinfo", "fullname mobile")
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

exports.leaderTaskList = [
  function (req, res) {
    try {
      var perPage = 10,
        page = Math.max(0, req.params.page);
      Tasks.find({ leader: req.user._id })
        .select(
          "taskname subject description startDate endDate followers leader beneficiary createdBy createdAt"
        )
        .limit(perPage)
        .skip(perPage * page)
        .sort({ createdAt: "desc" })
        .populate("followerslist", "fullname mobile")
        .populate("leaderinfo", "fullname mobile")
        .populate("beneficiaryinfo", "fullname mobile")
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

exports.taskDelete = [
  (req, res) => {
    try {
      Tasks.findByIdAndRemove(req.params.taskid, (err, data) => {
        if (!err)
          return apiResponse.successResponseWithData(
            res,
            "Data Deleted successfully.",
            data
          );
        else return apiResponse.errorResponse(res, err);
      });
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.taskComplete = [
  body("taskId").isLength({ min: 10 }),
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
        var file = JSON.parse(JSON.stringify(req.files));
        var file_name = new Date().getTime() + "_" + file.files.name;
        var buffer = new Buffer.from(file.files.data.data);
        fs.writeFile(`uploads/${file_name}`, buffer, async (err) => {
          fs.unlink(__dirname + "/" + file_name, () => {});
        });
        Tasks.findByIdAndUpdate(
          req.body.taskId,
          {
            completed: true,
            files: { filepath: `uploads/${file_name}` },
          },
          {},
          function (err) {
            if (err) {
              return apiResponse.errorResponse(res, err);
            } else {
              return apiResponse.successResponseWithData(
                res,
                "Task update Success.",
                req.body
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
