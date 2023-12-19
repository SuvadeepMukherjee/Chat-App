const express = require("express");
const router = express.Router();
const groupController = require("../controller/groupController");
const userAuthentication = require("../middleware/auth");

router.post("/createGroup", userAuthentication, groupController.createGroup);
router.get("/getGroups", userAuthentication, groupController.getGroups);
router.post("/addToGroup", userAuthentication, groupController.addTogroup);
router.post(
  "/deleteFromGroup",
  userAuthentication,
  groupController.deleteFromGroup
);

router.get(
  "/groupMembers/:groupName",
  userAuthentication,
  groupController.groupMembers
);

module.exports = router;
