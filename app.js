const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

//initializes an express application
const app = express();

//This server can receive request from any client for GET AND POST requests
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

/*
loads  environment variables from a .env file
 */
dotenv.config();

//importing sequelize and models
const sequelize = require("./util/database");

// Serve static files (e.g., CSS, JS) from the "public" folder
app.use(express.static("public"));

//importing routers
const userRouter = require("./router/userRouter");
const homePageRouter = require("./router/homePageRouter");
const chatRouter = require("./router/chatRouter");
const groupRouter = require("./router/groupRouter");

//Models
const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const Group = require("./models/groupModel");
const UserGroup = require("./models/userGroup");

// Parse incoming JSON data and make it available in req.body
app.use(bodyParser.json());

//middleware
app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/homePage", homePageRouter);
app.use("/chat", chatRouter);
app.use("/group", groupRouter);
//app.use("/group");

//associations

//User-chat
// Each user can be associated with multiple chat messages.
// The onDelete: "CASCADE" ensures that if a user is deleted,
// all their associated chat messages will also be deleted.
User.hasMany(Chat, { onDelete: "CASCADE", hooks: true });
// Each chat message is associated with a single user.
Chat.belongsTo(User);

//user-userGroup
// Each user can be associated with multiple UserGroup records,
// indicating their membership in different groups.
User.hasMany(UserGroup);

//Group-chat
// Each group can have multiple chat messages associated with it.
Group.hasMany(Chat);

//Group-userGroup
// Each group can have multiple UserGroup records,
// representing different users' memberships in the group.
Group.hasMany(UserGroup);

//userGroup-user
// Each UserGroup record is associated with a single user,
// indicating a user's membership in a group.
UserGroup.belongsTo(User);

//userGroup-Group
// Each UserGroup record is associated with a single group,
// indicating the group to which the user belongs.
UserGroup.belongsTo(Group);

const job = require("./jobs/cron");
job.start();
/* Syncs Sequelize models with the database( tabels are created or updated )
 and starts the server on port 3000.
 */
sequelize.sync().then((result) => {
  app.listen(3000);
});
