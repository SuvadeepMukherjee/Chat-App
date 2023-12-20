const User = require("../models/userModel");
const Group = require("../models/groupModel");
const UserGroup = require("../models/userGroup");
// Destructuring assignment to extract the 'Op' object from the 'sequelize' module
const { Op } = require("sequelize");
const sequelize = require("../util/database");

/*
- Handles the POST request on the endPoint group/createGroup
- We are making this request from createGroup function in group.js
- Before reaching this middleware the request passes through auth.js(authenticated user)
- creates a group, adds specified members to the group, designates one member as 
- an admin, and responds with group information. In case of an error, it returns a 500 Internal Server Error.
*/
exports.createGroup = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    //extract groupName and members from body
    const groupName = req.body.groupName;
    const members = req.body.members;

    //extract admin from auth.js(authenticated User)
    const admin = req.user.name;

    //create a new group
    const group = await Group.create(
      { name: groupName, admin },
      { transaction: t }
    );

    // Using Sequelize to retrieve users whose email matches any value in the 'members' array
    // The resulting 'invitedMembers' array will contain records that satisfy the OR condition.
    const invitedMembers = await User.findAll(
      {
        where: {
          email: {
            [Op.or]: members,
          },
        },
      },
      { transaction: t }
    );

    // Creating an array of promises, each representing the creation of a UserGroup record.
    // 'invitedMembers.map' iterates through each user in 'invitedMembers'.
    // The promises are in pending state
    const createUserGroupPromises = invitedMembers.map(async (member) => {
      // For each user, create a UserGroup record with specific properties.
      return UserGroup.create(
        {
          isadmin: false,
          userId: member.dataValues.id,
          groupId: group.dataValues.id,
        },
        { transaction: t }
      );
    });

    // Waiting for all UserGroup records to be created before proceeding
    //promises  get resolved
    const resolvedPromises = await Promise.all(createUserGroupPromises);

    // Creating a UserGroup record for the admin with 'isadmin' set to 'true'
    const userAdmin = await UserGroup.create(
      {
        isadmin: true,
        userId: req.user.id,
        groupId: group.dataValues.id,
      },
      { transaction: t }
    );

    //commit the transaction
    await t.commit();

    // Responding with a success message and information about the created group and its members
    res.status(201).json({ group: group.dataValues.name, members: members });
  } catch (err) {
    console.log(err);
    //rollback the transaction in case of an error
    await t.rollback();
    // Responding with a failure message
    res.status(500).json({ error: "Internal server error " });
  }
};

/*
- Handles the GET request on the endpoint group/getGroups
- We are making the request from the getGroups function in group.js(frontend)
- Before reaching this controller the request passes through auth.js(authenticated user)
- Retrieve groups along with admin information where the authenticated user is a member
*/
exports.getGroups = async (req, res, next) => {
  try {
    //retrieving groups from the Group model, including only the 'name' and 'admin' attributes.
    //The groups are filtered based on UserGroup records where the userId is equal to the authenticated user's id."
    const groups = await Group.findAll({
      attributes: ["name", "admin"],
      include: [
        {
          model: UserGroup,
          where: { userId: req.user.id },
        },
      ],
    });
    // Respond with a success message and group information
    res.status(200).json({ groups: groups });
  } catch (err) {
    console.log("Error in getting groups", err);

    // Respond with a 500 Internal Server Error in case of an erro
    res.status(500).json({ error: "Internal server error " });
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

exports.deleteFromGroup = async (req, res, next) => {
  try {
    //Extract group name and members from request body
    const groupName = req.body.groupName;
    const members = req.body.members;

    //Find the group with the specified name
    const group = await Group.findOne({ where: { name: groupName } });

    //Check if the group exists
    if (!group) {
      return res.status(201).json({ message: "Group does not exist" });
    }

    //Find an admin entry for the group and check if the current user is the admin
    const admin = await UserGroup.findOne({
      where: {
        [Op.and]: [{ isadmin: 1 }, { groupId: group.id }],
      },
    });

    //Return json if user is not admin
    if (!admin || admin.userId !== req.user.id) {
      return res
        .status(201)
        .json({ message: "Only admins can delete members" });
    }
    const deletedMembers = await User.findAll({
      where: {
        email: {
          [Op.or]: members,
        },
      },
    });

    //Delete each member from the group
    await Promise.all(
      deletedMembers.map(async (user) => {
        await UserGroup.destroy({
          where: {
            [Op.and]: [
              {
                isadmin: false,
                userId: user.id,
                groupId: group.id,
              },
            ],
          },
        });
      })
    );

    //returb success message if all members are deleted succesfully
    res.status(201).json({ message: "Members deleted succesfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.groupMembers = async (req, res, next) => {
  try {
    //Extract the group name from the request parameters
    const groupName = req.params.groupName;
    console.log("passed through groupName ", groupName);

    //Find the group based on the provided group name
    const group = await Group.findOne({ where: { name: groupName } });
    console.log("found the group", group);

    //Check if the group exists
    if (!group) {
      //If the group does'nt exist , return a 404 response
      return res.status(404).json({ error: "Group not found" });
    }

    //Retreive all user-group associations for the found group
    const userGroup = await UserGroup.findAll({
      where: { groupId: group.dataValues.id },
    });
    console.log("passed through userGroup", userGroup);

    //Initialize an array to store user information
    const users = [];

    //Use Promise.all to concurrently fetch user details for each user-group association
    await Promise.all(
      userGroup.map(async (user) => {
        const res = await User.findOne({
          where: { id: user.dataValues.userId },
        });
        users.push(res);
      })
    );

    console.log(
      "This is the users array which we are sending to our client",
      users
    );

    //Return a succesfull response with the list of users belonging to the group
    res.status(200).json({ users: users });
  } catch (err) {
    console.log("Error in groupMembers middleware", err);
  }
};
