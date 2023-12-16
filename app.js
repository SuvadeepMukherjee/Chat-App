const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./util/database");

sequelize.sync().then((result) => {
  app.listen(3000);
});
