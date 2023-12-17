const express = require("express");

//Creates a new router object in express , allows us to group related routes together
const router = express.Router();

const userController = require("../controller/userController");

router.get("/", userController.getSignUpPage);
router.get("/login", userController.getLoginPage);
router.post("/signup", userController.postUserSignUp);
router.post("/login", userController.postUserLogin);

module.exports = router;
