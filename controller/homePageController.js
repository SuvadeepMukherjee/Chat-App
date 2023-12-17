const path = require("path");

const rootDir = require("../util/path");
/*
Express route handler : Serves the home page
*/
exports.getHomePage = (req, res, next) => {
  //construct the filePath for the home page
  const filePath = path.join(rootDir, "views", "homePage.html");

  //Sending the home page as the response
  res.sendFile(filePath);
};
