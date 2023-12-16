const express = require("express");
const dotenv = require("dotenv");

/*
loads  environment variables from a .env file
 */
dotenv.config();

//importing sequelize and models
const sequelize = require("./util/database");

//initializes an express application
const app = express();

// Serve static files (e.g., CSS, JS) from the "public" folder
app.use(express.static("public"));

//importing routers
const userRouter = require("./router/userRouter");

//middleware
app.use("/", userRouter);
app.use("/user", userRouter);

//associations

/* Syncs Sequelize models with the database( tabels are created or updated )
 and starts the server on port 3000.
 */
sequelize.sync().then((result) => {
  app.listen(3000);
});
