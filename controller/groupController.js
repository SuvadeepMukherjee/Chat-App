const User = require("../models/userModel");
const Group = require("../models/groupModel");
const UserGroup = require("../models/userGroup");
const { Op } = require("sequelize");

exports.createGroup = async (req, res, next) => {
  try {
    const groupName = req.body.groupName;
    const admin = req.user.name;
    const members = req.body.members;

    //create a new group
    const group = await Group.create({ name: groupName, admin });

    //Find invited members
    const invitedMembers = await User.findAll({
      where: {
        email: {
          [Op.or]: members,
        },
      },
    });

    //result is an array of promises, each representing the creation of a UserGroup record.
    const createUserGroupPromises = invitedMembers.map(async (member) => {
      return UserGroup.create({
        isadmin: false,
        userId: member.dataValues.id,
        groupId: group.dataValues.id,
      });
    });

    await Promise.all(createUserGroupPromises);

    await UserGroup.create({
      isadmin: true,
      userId: req.user.id,
      groupId: group.dataValues.id,
    });
    res.status(201).json({ group: group.dataValues.name, members: members });
  } catch (err) {
    console.log(err);
  }
};
