var express = require("express");
const AuthController = require("../controllers/AuthController");
const TaskControllers = require("../controllers/TaskControllers");
const auth = AuthController.authenticateToken ;
var router = express.Router();
router.post("/register", AuthController.register);
router.post("/login",AuthController.login);
router.post("/profileupdate", auth, AuthController.profileupdate);
router.post("/changepassword", auth, AuthController.changePassword);
router.get("/user-info", auth, AuthController.userInfo);
router.get("/get-users-list", auth, AuthController.userList);
/*=============== Task Route =========================*/
router.post("/add-new-task", auth, TaskControllers.addTasks);
router.post("/update-task", auth, TaskControllers.updateTasks);
router.get("/taskInfo:taskid", auth, TaskControllers.taskInfo);
router.get("/get-task-list", auth, TaskControllers.taskList);

module.exports = router;