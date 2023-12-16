const path = require("path");

// Imports the root directory path of the Node.js application(app.js)
const rootDir = require("../util/path");

/*
Express route handler : Serves the sign-up page
*/
exports.getSignUpPage = (req, res, next) => {
  //construct the filePath for the sign-up page
  const filePath = path.join(rootDir, "views", "sign-up.html");

  //Sending the sign-up page as the response
  res.sendFile(filePath);
};
