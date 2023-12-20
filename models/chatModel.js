const sequelize = require("../util/database");
const Sequelize = require("sequelize");

// Defines a Sequelize model 'Chat' for the 'chats' table with
// specified attributes and data types.
const Chat = sequelize.define("chats", {
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

module.exports = Chat;
