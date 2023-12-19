const Chat = require("../models/chatModel");
const Group = require("../models/groupModel");

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
