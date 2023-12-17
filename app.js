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

//Models
const User = require("./models/userModel");
const Chat = require("./models/chatModel");

// Parse incoming JSON data and make it available in req.body
app.use(bodyParser.json());

//middleware
app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/homePage", homePageRouter);
app.use("/chat", chatRouter);

//associations
User.hasMany(Chat, { onDelete: "CASCADE" });
Chat.belongsTo(User);

/* Syncs Sequelize models with the database( tabels are created or updated )
 and starts the server on port 3000.
 */
sequelize.sync().then((result) => {
  app.listen(3000);
});
