const path = require("path");
//provides a set of standard operators that can be used in queries to perform complex conditions.

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
// imports the Op (Operator) object from the Sequelize library
const { Op } = require("sequelize");
const sequelize = require("../util/database");

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

/*
Express route handler : Serves the login page
*/
exports.getLoginPage = (req, res, next) => {
  //construct the filePath for the sign-up page
  const filePath = path.join(rootDir, "views", "login.html");

  //Sending the sign-up page as the response
  res.sendFile(filePath);
};

/* 
- Handles POST requests on the endpoint user/signup
- Uses Sequelize transaction to ensure database consistency
- Extracts data from request body 
- Find users on basis of email or number
- If user exists returns the function with a 409 status
- Hashes the password for new users 
- Creates a new user 
- Sends 200 OK on succesfull signup 
- Sends 500 on internal servor errror 
*/
exports.postUserSignUp = async (req, res, next) => {
  // Start a Sequelize transaction to ensure database consistency
  const t = await sequelize.transaction();
  try {
    //extract data from the request body
    const name = req.body.nameValue;
    const email = req.body.emailValue;
    const number = req.body.phoneValue;
    const password = req.body.passwordValue;

    //Find a user in the database where either the email or number matches the provided values
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { number }],
      },
    });
    //if user exists in db return the fumction with 409 status
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "This email or password already exists" });
    }

    //hash the oassword (salt=10)
    const hash = await bcrypt.hash(password, 10);

    //create a new User
    await User.create({
      name: name,
      email: email,
      number: number,
      password: hash,
      transaction: t,
    });
    //commit the transaction if all operations were succesfull
    await t.commit();
    //send a succes response
    res.status(200).json({
      success: true,
      message: "Signup Successful!",
    });
  } catch (err) {
    console.log(err);
    //Rollback the transaction if there's an error
    await t.rollback();
    //send an error response
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
