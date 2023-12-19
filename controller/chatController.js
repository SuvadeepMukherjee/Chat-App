const Chat = require("../models/chatModel");
const Group = require("../models/groupModel");

const sequelize = require("../util/database");

//socket server runs on PORT 5000 and allows requests from PORT 3000
const io = require("socket.io")(5000, {
  cors: {
    // Specify the allowed origin for cross-origin requests.
    origin: "http://localhost:3000",
  },
});

//callback runs when a new client connects to the socket.io server
io.on("connection", (socket) => {
  //callback  runs when the client emits a getMessages event
  //client emits getMessages with the groupName
  socket.on("getMessages", async (groupName) => {
    try {
      //Find the group from the database
      const group = await Group.findOne({ where: { name: groupName } });

      //retreive all messages associated with the group
      const messages = await Chat.findAll({
        where: { groupId: group.dataValues.id },
      });

      //Emit the retreived messages to the client(chat.js)
      socket.emit("messages", messages);
    } catch (err) {
      console.log(err);
    }
  });
});

/*
- Handles the POST request on the endpoint /chat/sendMessage 
- We are making the POST request from the messageSend function in chat.js 
- Before Passing this controller this controller reaches the auth.js(authenticated user)
- This controller handles sending chat messages to a group. It extracts necessary data from the request,
- creates a new chat entry in the database, and returns a success message or a 500 status in case of an error.
*/
exports.sendMessage = async (req, res, next) => {
  // Start a transaction
  const t = await sequelize.transaction();
  try {
    // Extract group name and message from the request
    const groupName = req.body.groupName;
    const message = req.body.message;

    //extract name sent from auth.js
    const user = req.user.name;

    //Find group from db
    const group = await Group.findOne({
      where: { name: groupName },
    });

    //extract group-id from values returned from db
    const groupId = group.dataValues.id;

    //Create a new chat entry within the transaction
    const chatDB = await Chat.create(
      {
        name: user,
        message: message,
        userId: req.user.id,
        groupId: group.dataValues.id,
      },
      //commit the transaction on success
      { transaction: t }
    );
    //commits the transaction
    await t.commit();

    //respond with success message
    return res.status(200).json({ message: "Success!" });
  } catch (err) {
    console.log(err);
    //rolls back the transaction on failure
    await t.rollback();

    //respond with an error message
    return res.status(500).json({ error: "Message delivery failed" });
  }
};
