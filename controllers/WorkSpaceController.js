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
          members: req.body.members,
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

// exports.getWorkplaceUsers = [
//   (req,res)=>{
//     const {id} = req.params.id;
//     try{

//       const users = WorkSpace
//     }
//     catch(e){
//       apiResponse.errorResponse(res, err);
//     }
//   }
// ]
exports.fetchWorkSpace = [
  (req, res) => {
    try {
      WorkSpace.find(
        {
          $or: [
            { members: { $in: [req.user.id] } },
            { createdBy: req.user._id },
          ],
        },
        function (err, workspaces) {
          if (err) {
            console.log(err);
            return apiResponse.errorResponse(res, err);
          }
          return apiResponse.successResponseWithData(
            res,
            "Workspaces fetched.",
            workspaces
          );
        }
      );
    } catch (err) {
      console.log(err);
      apiResponse.errorResponse(res, err);
    }
  },
];

exports.getWorkspace = [
  async (req, res) => {
    const { id } = req.params;
    console.log(`Workflow id`, id);

    try {
      const workplace = await WorkSpace.findOne({ _id: id });

      console.log(workplace);
      return apiResponse.successResponseWithData(
        res,
        "Workflow fetched",
        workplace
      );
    } catch (e) {
      return apiResponse.errorResponse(res, "Invalid workplace id");
    }
  },
];

exports.deleteWorkSpace = [
  async (req, res) => {
    const { id } = req.params;

    try {
      const deleted = await WorkSpace.deleteOne({
        createdBy: req.user._id,
        _id: id,
      });
      if (!deleted) {
        apiResponse.errorResponse(res, "Error in deleting the workplace");
      } else {
        const workplaces = await WorkSpace.find({ createdBy: req.user._id });
        apiResponse.successResponseWithData(
          res,
          "Successfully workplace deleted!",
          workplaces
        );
      }
    } catch (e) {
      apiResponse.errorResponse(res, err);
    }
  },
];

exports.modifyWorkplace = [
  async (req, res) => {
    const { id } = req.params;
    const { name, description, members } = req.body;
    console.log(id, name, description, members);

    console.log(req.body);

    try {
      const modified = await WorkSpace.updateOne(
        {
          createdBy: req.user._id,
          _id: id,
        },
        { name: name, description: description, members: members }
      );

      console.log(modified);
      if (!modified) {
        apiResponse.errorResponse(res, "Error in updating the workplace");
      } else {
        const workplaces = await WorkSpace.find({ createdBy: req.user._id });
        apiResponse.successResponseWithData(
          res,
          "Successfully workplace updated!",
          workplaces
        );
      }
    } catch (e) {
      apiResponse.errorResponse(res, err);
    }
  },
];
