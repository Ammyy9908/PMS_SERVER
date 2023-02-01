var { Tasks } = require("../models/Tasks");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage }).single("document");

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
          endTime: req.body.endTime,
          workplace_id: req.body.workplace_id,
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
          "taskname subject description startDate endDate followers leader beneficiary createdBy createdAt completed files"
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
      Tasks.find()
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

exports.taskDelete = [
  async (req, res) => {
    const task = await Tasks.findOne({ _id: req.params.taskId });

    const isLeader = task.leader === req.user._id ? true : false;
    const isCreator = task.createdBy === req.user._id ? true : false;

    if (isLeader || isCreator) {
      try {
        let deleted = await Tasks.deleteOne({
          _id: req.params.taskId,
        });
        if (deleted) {
          return apiResponse.successResponseWithData(
            res,
            "Task Deleted successfully.",
            deleted
          );
        }
      } catch (err) {
        return apiResponse.errorResponse(res, err);
      }
    } else {
      return apiResponse.errorResponse(res, "You are not authorized to delete");
    }
  },
];

exports.taskComplete = [
  body("taskId").isLength({ min: 10 }),
  async (req, res) => {
    console.log("Files", req.files);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        console.log("Inside Else");
        if (req.files) {
          console.log(req.body.taskId);
          var file = req.files.document;
          console.log("File Name", file);
          var file_name = new Date().getTime() + "_" + file.name;
          var buffer = new Buffer.from(file.data);
          fs.writeFile(`public/uploads/${file_name}`, buffer, async (err) => {
            fs.unlink(__dirname + "/" + file_name, () => {});
          });
          const completed = await Tasks.findOneAndUpdate(req.body.taskId, {
            completed: true,
            files: {
              filepath: `http://20.219.16.124:5001/static/uploads/${file_name}`,
            },
          });

          if (!completed) {
            return apiResponse.errorResponse(res, "Error in submitting Task");
          }
          return apiResponse.successResponse(
            res,
            "Task Completed Successfully"
          );
        }
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  },
];
