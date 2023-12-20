//External module imports
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

/*
loads  environment variables from a .env file
 */
dotenv.config();

//Internal module imports
const sequelize = require("./util/database");
const job = require("./jobs/cron");

//Model imports
const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const Group = require("./models/groupModel");
const UserGroup = require("./models/userGroup");

//Routers
const userRouter = require("./router/userRouter");
const homePageRouter = require("./router/homePageRouter");
const chatRouter = require("./router/chatRouter");
const groupRouter = require("./router/groupRouter");

// express app initialization
const app = express();

/*
- Middleware
*/
app.use(express.static("public"));
//This server can receive request from any client for GET AND POST requests
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
// Parse incoming JSON data and make it available in req.body
app.use(bodyParser.json());

//Routes
app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/homePage", homePageRouter);
app.use("/chat", chatRouter);
app.use("/group", groupRouter);

//Sequelize Model Associations
User.hasMany(Chat, { onDelete: "CASCADE", hooks: true });
Chat.belongsTo(User);
User.hasMany(UserGroup);
Group.hasMany(Chat);
Group.hasMany(UserGroup);
UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);

//job
job.start();

/* Syncs Sequelize models with the database( tabels are created or updated )
 and starts the server on port 3000.
 */
sequelize.sync().then((result) => {
  app.listen(3000);
});
