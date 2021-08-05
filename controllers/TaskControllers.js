var { Tasks } = require('../models/Tasks')
const { body, validationResult } = require('express-validator');
const apiResponse = require("../helpers/apiResponse");

exports.addTasks = [
    body('taskname').isLength({ min: 4 }),
    body('subject').isLength({ min: 10 }),
    body('description').isLength({ min: 10 }),
    body('users').isArray(),
    (req, res) => {
        try {
           const errors = validationResult(req);
           if(!errors.isEmpty())
           {
               return apiResponse.validationErrorWithData(res, "Validation Error .",errors.array());
           }
           else{
                var task = new Tasks({
                    taskname: req.body.taskname,
                    subject : req.body.subject,
                    description : req.body.description,
                    startDate : req.body.startDate,
                    endDate : req.body.endDate,
                    createdBy : req.user._id,
                    users : req.body.users,
                    beneficiary : req.body.beneficiary,
                });
                task.save(function (err){
                if(err) { return apiResponse.errorResponse(req , err);}
                    let taskData = {
                        _id : task._id,
                        taskname : task.taskname,
                        subject : task.subject,
                        description : task.description,
                        startDate : task.startDate,
                        endDate : task.endDate,
                        users : task.users,
                        beneficiary : task.beneficiary,
                    };
                    return apiResponse.successResponseWithData(res , "Registration Success.",taskData);
                });
           }
        }
        catch(err){
            apiResponse.errorResponse(res ,err);
        }
    }
];

exports.updateTasks = [
    body('taskId').isLength({ min: 10 }),
    (req , res) => {
        try
        {
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            }
            else{
                Tasks.findByIdAndUpdate(req.body.taskId, {
                    taskname: req.body.taskname,
                    subject : req.body.subject,
                    description : req.body.description,
                    startDate : req.body.startDate,
                    endDate : req.body.endDate,
                    createdBy : req.user._id,
                    users : req.body.users,
                    beneficiary : req.body.beneficiary,
                }, {},function (err) {
                    if (err) { 
                        return apiResponse.errorResponse(res, err); 
                    }else{
                        return apiResponse.successResponseWithData(res,"Task update Success.", req.body);
                    }
                });
            }
        }
        catch (err)
        {
            console.log(err)
            return apiResponse.errorResponse(res, err);
        }
    }
];

exports.taskInfo = [
    (req , res) => {
        try
        {
            Tasks.findOne({_id : req.params.taskid}).select('taskname subject description startDate endDate users beneficiary createdBy createdAt').populate('userinfo', 'fullname mobile').exec(function(err, data) {
                if(data){
                    return apiResponse.successResponseWithData(res, "Data retrieved successfully.", data);
                }else{
                    return apiResponse.errorResponse(res, err);
                }
            });
        }
        catch (err)
        {
            return apiResponse.errorResponse(res, err);
        }
    }
];

exports.taskList = [
	function (req, res) {
		try {
			Tasks.find().select('taskname subject description startDate endDate users beneficiary createdBy createdAt').populate('userinfo', 'fullname mobile').then((userstatus)=>{
				if(userstatus.length > 0){
					return apiResponse.successResponseWithData(res, "Data retrieved successfully.", userstatus);
				}else{
					return apiResponse.successResponseWithData(res, "No Record Found.", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.errorResponse(res, err);
		}
	}
];

exports.createdTaskList = [
	function (req, res) {
		try {
			Tasks.find({ createdBy: req.user._id}).select('taskname subject description startDate endDate users beneficiary createdBy createdAt').populate('userinfo', 'fullname mobile').then((userstatus)=>{
				if(userstatus.length > 0){
					return apiResponse.successResponseWithData(res, "Data retrieved successfully.", userstatus);
				}else{
					return apiResponse.successResponseWithData(res, "No Record Found.", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.errorResponse(res, err);
		}
	}
];





