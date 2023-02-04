var express = require("express");
const AuthController = require("../controllers/AuthController");
const TaskControllers = require("../controllers/TaskControllers");
const WorkSpaceController = require("../controllers/WorkSpaceController");
const ReviewController = require("../controllers/ReviewController");
const { Users } = require("../models/Users");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = AuthController.authenticateToken;
var router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/send-otp", AuthController.sendOtp);
router.post("/validate-otp", AuthController.validateOtp);
router.post(
  "/forgot-password",
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
        const user = await Users.findOne({ email: req.body.email });

        if (!user) {
          return apiResponse.errorResponse(res, "Unauthorized");
        }

        // update the password with encrypted password

        const hashed = await bcrypt.hashSync(req.body.password, 10);

        const updated = await Users.updateOne(
          { email: req.body.email },
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
  }
);
router.put("/profileupdate", auth, AuthController.profileupdate);
router.post("/changepassword", auth, AuthController.changePassword);
router.get("/user-info", auth, AuthController.userInfo);
router.get("/profile/:id", auth, AuthController.getProfile);
router.get("/get-users-list", auth, AuthController.userList);
router.post("/profile/workspace/switch", auth, AuthController.changeWorkSpace);
/*=============== Task Route =========================*/
router.post("/add-new-task", auth, TaskControllers.addTasks);
router.post("/update-task", auth, TaskControllers.updateTasks);
router.get("/task-info/:taskid", auth, TaskControllers.taskInfo);
router.get("/task-list", auth, TaskControllers.taskList);
router.get("/created-tasks", auth, TaskControllers.createdTasks);
router.get("/following-task-list", auth, TaskControllers.followingTaskList);
router.get("/leader-task-list", auth, TaskControllers.leaderTaskList);
router.delete("/delete-task/:taskId", auth, TaskControllers.taskDelete);
router.post("/complete-task", auth, TaskControllers.taskComplete);
router.patch("/close-task/:id", auth, TaskControllers.taskClose);
router.post("/task/review", auth, ReviewController.createReview);
/*======WorkSpace Route========= */
router.post("/workspace/create", auth, WorkSpaceController.createWorkSpace);
router.get("/workspace/list", auth, WorkSpaceController.fetchWorkSpace);
router.delete("/workspace/:id", auth, WorkSpaceController.deleteWorkSpace);
router.post("/workspace/:id", auth, WorkSpaceController.modifyWorkplace);
module.exports = router;
