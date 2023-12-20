const Sequelize = require("sequelize");
const sequelize = require("../util/database");

// Defines a Sequelize model 'Group' for the 'groups' table with
// specified attributes and data types.
const Group = sequelize.define("groups", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  admin: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Group;
