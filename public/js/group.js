const createGroupBtn = document.getElementById("createGroup");
const addToGroupBtn = document.getElementById("addToGroup");
const deleteFromGroupBtn = document.getElementById("deleteFromGroup");
const logoutBtn = document.getElementById("logout");
const groupMembersBtn = document.getElementById("groupMembers");

async function createGroup() {
  try {
    const groupName = prompt("Group name");
    const members = [];
    let userInput;
    while (userInput !== "done") {
      userInput = prompt(
        `Enter the email Id of Users to Add! Please Enter Valid Email Id Otherwise User will not get Added. Type "done" when you finished!`
      );
      if (userInput !== "done") {
        members.push(userInput);
      }
    }
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "http://localhost:3000/group/createGroup",
      {
        groupName: groupName,
        members: members,
      },
      { headers: { Authorization: token } }
    );
    alert(`${groupName} Created Succesfully`);
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function getGroups() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:3000/group/getGroups", {
      headers: { Authorization: token },
    });
    getGroups.innerHTML = "";
    res.data.groups.forEach((group) => {
      const li = document.createElement("li");
      const div1 = document.createElement("div");
      const div2 = document.createElement("div");
      const span = document.createElement("span");
      const p = document.createElement("p");

      div1.classList.add("d-flex", "bd-highlight");
      div2.className = "user_info";
      span.appendChild(document.createTextNode(group.name));
      p.appendChild(document.createTextNode(`${group.admin} is Admin`));

      div2.appendChild(span);
      div2.appendChild(p);

      div1.appendChild(div2);
      li.appendChild(div1);
      groups.appendChild(li);
    });
  } catch (err) {
    console.log(err);
  }
}

async function addToGroup() {
  try {
    const groupName = prompt("Group Name");
    const members = [];
    let userInput;
    while (userInput !== "done") {
      userInput = prompt(
        `Enter the email Id of Users to Add! Please Enter Valid Email Id Otherwise User will not get Added. Type "done" when you finished!`
      );
      if (userInput !== "done") {
        members.push(userInput);
      }
    }
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "http://localhost:3000/group/addToGroup",
      {
        groupName: groupName,
        members: members,
      },
      {
        headers: { Authorization: token },
      }
    );
    alert(res.data.message);
    window.location.reload();
  } catch (err) {
    console.log("Error in addToGroup functiom", err);
  }
}

async function deleteFromGroup() {
  try {
    const groupName = prompt("Group Name");
    const members = [];
    let userInput;
    while (userInput !== "done") {
      userInput = prompt(
        `Enter the email Id of Users to Delete! Please Enter Valid Email Id Otherwise User will not get Deleted. Type "done" when you finished!`
      );
      if (userInput !== "done") {
        members.push(userInput);
      }
    }
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "http://localhost:3000/group/deleteFromGroup",
      {
        groupName: groupName,
        members: members,
      },
      {
        headers: { Authorization: token },
      }
    );
    alert(res.data.message);
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
}
async function groupMembers() {
  try {
    // Get the chat box body element
    const chatBoxBody = document.getElementById("chatBoxBody");

    // Check if there are existing group members divs, and remove them to avoid duplication
    if (chatBoxBody.querySelector(".groupMembersDiv")) {
      const members = chatBoxBody.querySelectorAll(".groupMembersDiv");
      members.forEach((member) => {
        member.remove();
      });
    }
    //Get the currently selected group name from local storage
    const groupName = localStorage.getItem("groupName");

    //If no group is selected , display an alert and exit the function
    if (!groupName || groupName === "") {
      return alert("Select the Group whose Members you want to see!");
    }

    //Get the user authentication token from local storage
    const token = localStorage.getItem("token");

    //Make an API request to get the members of the selected group
    const res = await axios.get(
      `http://localhost:3000/group/groupMembers/${groupName}`,
      {
        headers: { Authorization: token },
      }
    );
    console.log(res.data.users);

    //Iterte over the retreived users and dynamically create HTML elements to display group members
    res.data.users.forEach((user) => {
      //Create a new div for each group member
      const div = document.createElement("div");
      div.classList.add(
        "d-flex",
        "justify-content-center",
        "groupMembersDiv",
        "text-white"
      );
      //Create a paragraph element containing the group members name
      const p = document.createElement("p");
      p.appendChild(document.createTextNode(`${user.name} is a Member`));

      //append the paragraph to the div, and the div to the chat box body
      div.appendChild(p);
      chatBoxBody.appendChild(div);
    });
  } catch (err) {
    console.log(err);
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "http://localhost:3000/user/login";
}

//event listeners
createGroupBtn.addEventListener("click", createGroup);
document.addEventListener("DOMContentLoaded", getGroups);
addToGroupBtn.addEventListener("click", addToGroup);
deleteFromGroupBtn.addEventListener("click", deleteFromGroup);
logoutBtn.addEventListener("click", logout);
groupMembersBtn.addEventListener("click", groupMembers);
