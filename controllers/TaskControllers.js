var { Tasks } = require('../models/Tasks')
const { body, validationResult } = require('express-validator');
const apiResponse = require("../helpers/apiResponse");

exports.addTasks = [
    body('fullname').isLength({ min: 1 }),
    body('designation').isLength({ min: 1 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('mobile').isLength({ min: 5 }),
    (req, res) => {
        try {
           const errors = validationResult(req);
           if(!errors.isEmpty())
           {
               return apiResponse.validationErrorWithData(res, "Validation Error .",errors.array());
           }
           else{
                bcrypt.hash(req.body.password,10, function(err , hash){
                    let otp = utility.randomNumber(4);
                    var usr = new Users({
                        fullname: req.body.fullname,
                        designation : req.body.designation,
                        organization : req.body.organization,
                        fathername : req.body.fathername,
                        password : hash,
                        mobile : req.body.mobile,
                        email : req.body.email,
                        aadhar : req.body.aadhar,
                        dateofbirth : req.body.dateofbirth,
                    });
                    usr.save(function (err){
                    if(err) { return apiResponse.errorResponse(req , err);}
                        let userData = {
                            _id : usr._id,
                            fullname : usr.fullname,
                            designation : usr.designation,
                            organization : usr.organization,
                            fathername : usr.fathername,
                            mobile : usr.mobile,
                            email : usr.email,
                            aadhar : usr.aadhar,
                            dateofbirth : usr.dateofbirth,
                        };
                        return apiResponse.successResponseWithData(res , "Registration Success.",userData);
                    });
               });
           }
        }
        catch(err){
            apiResponse.errorResponse(res ,err);
        }
    }
];

exports.updateTasks = [
    body('fullname').isLength({ min: 1 }),
    body('mobile').isLength({ min: 1 }),
    (req , res) => {
        try
        {
            console.log(req.user)
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            }
            else{
                Users.findByIdAndUpdate(req.user._id, req.body, {},function (err) {
                    if (err) { 
                        return apiResponse.errorResponse(res, err); 
                    }else{
                        return apiResponse.successResponseWithData(res,"Profile update Success.", req.body);
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
            Users.findById(req.user._id,'fullname designation organization fathername mobile email aadhar dateofbirth createdAt' ,function (err, user){ 
                if (err){ 
                    return apiResponse.unauthorizedResponse(res, "User no found.");
                } 
                else{ 
                    return apiResponse.successResponseWithData(res,"Data retrieved successfully.", user);
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
			Users.find().select('fullname designation organization fathername mobile email aadhar dateofbirth createdAt').then((userstatus)=>{
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





