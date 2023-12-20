const express = require("express");
const router = express.Router();
const groupController = require("../controller/groupController");
const userAuthentication = require("../middleware/auth");

router.post("/createGroup", userAuthentication, groupController.createGroup);
router.get("/getGroups", userAuthentication, groupController.getGroups);
router.post("/addToGroup", userAuthentication, groupController.addTogroup);
//Including :id in the route path allows these routes to capture the  ID from the URL.
//This ID is then used to identify the specific expense to be deleted or edited.
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
