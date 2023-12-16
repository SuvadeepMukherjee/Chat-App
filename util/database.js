/*
initializes a Sequelize instance configured to connect to a MySQL database and makes it available for use 
in other parts of the application through module exports. 
The actual connection to the database is established when Sequelize methods are invoked during subsequent 
interactions with the exported sequelize object.
*/

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
  }
);

module.exports = sequelize;
