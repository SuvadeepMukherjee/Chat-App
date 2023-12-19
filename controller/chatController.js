const Chat = require("../models/chatModel");
const Group = require("../models/groupModel");
const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  //block of code runs when a new client connects to the socket.io server
  socket.on("getMessages", async (groupName) => {
    //block of code runs when the client emits a getMessages event
    try {
      //Find the group
      const group = await Group.findOne({ where: { name: groupName } });

      //retreive all messages associated with the group
      const messages = await Chat.findAll({
        where: { groupId: group.dataValues.id },
      });

      //Emit the retreived messages to all connected clients
      socket.emit("messages", messages);
    } catch (err) {
      console.log(err);
    }
  });
});

exports.sendMessage = async (req, res, next) => {
  try {
    //extract groupName and message
    const groupName = req.body.groupName;
    const message = req.body.message;

    //extract message from auth.js
    const user = req.user.name;

    const group = await Group.findOne({
      where: { name: groupName },
    });

    const groupId = group.dataValues.id;

    const chatDB = await Chat.create({
      name: user,
      message: message,
      userId: req.user.id,
      groupId: group.dataValues.id,
    });

    return res.status(200).json({ message: "Success!" });
  } catch (err) {
    console.log(err);
  }
};
