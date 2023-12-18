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

exports.getGroups = async (req, res, next) => {
  try {
    console.log("inside get groups controller");
    const groups = await Group.findAll({
      attributes: ["name", "admin"],
      include: [
        {
          model: UserGroup,
          where: { userId: req.user.id },
        },
      ],
    });
    res.status(200).json({ groups: groups });
  } catch (err) {
    console.log("Error in getting groups", err);
  }
};

exports.addTogroup = async (req, res, next) => {
  try {
    //extract group name and members from request body
    const groupName = req.body.groupName;
    const members = req.body.members;

    //Find the group with the specified name
    const group = await Group.findOne({ where: { name: groupName } });

    //Check if the group exists
    if (!group) {
      return res.status(201).json({ message: "Group does not exist! " });
    }

    //Find an admin entry for the group and check if the current user is the admin
    const admin = await UserGroup.findOne({
      where: {
        isadmin: 1,
        groupId: group.id,
      },
    });

    //If not admin send an json
    if (!admin || admin.userId !== req.user.id) {
      return res
        .status(201)
        .json({ message: "Only admins can add new members." });
    }

    //Find user instances corresponding to the specified emails
    const invitedMembers = await User.findAll({
      where: {
        email: {
          [Op.or]: members,
        },
      },
    });

    //Add each invited member to group
    await Promise.all(
      invitedMembers.map((user) =>
        UserGroup.create({
          isadmin: false,
          userId: user.id,
          groupId: group.id,
        })
      )
    );

    res.status(201).json({ message: "Members added succesfully!" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Internal Server Error" });
  }
};
