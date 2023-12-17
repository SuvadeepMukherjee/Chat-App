const Chat = require("../models/chatModel");

exports.sendMessage = async (req, res, next) => {
  try {
    const createdMessage = await Chat.create({
      name: req.user.name,
      message: req.body.message,
      userId: req.user.id,
    });
    return res.status(200).json({ message: "Success!" });
  } catch (err) {
    console.log("Error in send Message controller", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
