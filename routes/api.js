var express = require("express");
const AuthController = require("../controllers/AuthController");
var router = express.Router();
router.post("/register", AuthController.register);
router.post("/login",AuthController.login);
router.post("/profileupdate", AuthController.profileupdate);
router.post("/changepassword",AuthController.changePassword);
router.get("/user-info",AuthController.userInfo);
module.exports = router;