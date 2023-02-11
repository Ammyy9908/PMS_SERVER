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
      Tasks.find({
        $or: [
          { leader: req.user._id },
          { createdBy: req.user._id },
          { followers: req.user._id },
        ],
      })
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

exports.taskClose = [
  body("taskId").isLength({ min: 10 }),
  async (req, res) => {
    const { id } = req.params;
    const uptaded = await Tasks.updateOne({ _id: id }, { completed: true });

    if (!uptaded) {
      return apiResponse.errorResponse(res, "Unable to close this task");
    }
    return apiResponse.successResponse(res, "Task closed successfully");
  },
];

exports.getUserCompletedTasks = [
  async (req, res) => {
    const { id } = req.params;
    console.log("UID", id);
    const completed = await Tasks.find({
      followers: { $in: [id] },
      completed: true,
    });
    if (!completed.length) {
      return apiResponse.errorResponse(res, "No Records found");
    }
    return apiResponse.successResponseWithData(res, "Records Found", completed);
  },
];

exports.getUserPendingTasks = [
  async (req, res) => {
    const { id } = req.params;
    console.log("UID", id);
    const completed = await Tasks.find({
      followers: { $in: [id] },
      completed: false,
    });
    if (!completed.length) {
      return apiResponse.errorResponse(res, "No Records found");
    }
    return apiResponse.successResponseWithData(res, "Records Found", completed);
  },
];

exports.getUserTasks = [
  body("taskId").isLength({ min: 10 }),
  async (req, res) => {
    console.log(req.params.uid);
    const tasks = await Tasks.find({ followers: req.params.uid });

    if (tasks.length) {
      return apiResponse.successResponseWithData(res, "Tasks fetched", tasks);
    }
    return apiResponse.errorResponse(res, "No Tasks found for this user");
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
        if (req.files) {
          var file = req.files.document;
          var file_name = new Date().getTime() + "_" + file.name;
          var buffer = new Buffer.from(file.data);
          fs.writeFile(`public/uploads/${file_name}`, buffer, async (err) => {
            fs.unlink(__dirname + "/" + file_name, () => {});
          });
          const completed = await Tasks.updateOne(
            { _id: req.body.taskId },
            {
              $push: {
                files: {
                  filepath: `http://20.219.16.124:5001/static/uploads/${file_name}`,
                  filename: `http://20.219.16.124:5001/static/uploads/${file_name}`,
                  submitted_by: { name: req.user.fullname, id: req.user._id },
                },
              },
            }
          );

          if (!completed) {
            return apiResponse.errorResponse(res, "Error in submitting Task");
          }

          const task = await Tasks.findOne({ _id: req.body.taskId });

          return apiResponse.successResponseWithData(
            res,
            "Task Completed Successfully",
            task
          );
        }
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  },
];
