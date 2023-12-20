// Import the CronJob class from the 'cron' library
const CronJob = require("cron").CronJob;
const Sequelize = require("sequelize");
const Chat = require("../models/chatModel");
const ArchivedChat = require("../models/archivedChatModel");

// cron job is scheduled to run every day at midnight
const job = new CronJob("0 0 * * *", async function () {
  //Calulate the timestamp for yesterday
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago

  //Find chats created before yesterday
  const chats = await Chat.findAll({
    where: {
      // Using Sequelize.Op.lt to filter records where the 'createdAt' timestamp is less than yesterday
      //lt stands for less than
      createdAt: {
        [Sequelize.Op.lt]: yesterday,
      },
    },
  });

  //Bulk create archived chats, bulkCreate method automatically added to each model
  await ArchivedChat.bulkCreate(chats);

  //Destroy chats created before yesterday
  await Chat.destroy({
    where: {
      // Using Sequelize.Op.lt to filter records where the 'createdAt' timestamp is less than yesterday
      //lt stands for less than
      createdAt: {
        [Sequelize.Op.lt]: yesterday,
      },
    },
  });
});

module.exports = job;
