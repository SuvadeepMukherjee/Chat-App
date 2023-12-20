const Sequelize = require("sequelize");
const sequelize = require("../util/database");

// Defines a Sequelize model 'UserGroup' for the 'UserGroup' table with
// specified attributes and data types.
const UserGroup = sequelize.define("UserGroup", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  isadmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = UserGroup;
