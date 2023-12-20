const sequelize = require("../util/database");
const Sequelize = require("sequelize");

// Defines a Sequelize model 'ArchivedChat' for the 'archivedChats' table with
// specified attributes and data types.
const ArchivedChat = sequelize.define("archivedChats", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  message: {
    type: Sequelize.STRING,
  },
});

module.exports = ArchivedChat;
