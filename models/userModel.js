const Sequelize = require("sequelize");
const sequelize = require("../util/database");

// Defines a Sequelize model 'User' for the 'users' table with
// specified attributes and data types.
const User = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  number: Sequelize.STRING,
  password: Sequelize.STRING,
});

module.exports = User;
