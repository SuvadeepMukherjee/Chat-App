const createGroupBtn = document.getElementById("createGroup");

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

//event listeners
createGroupBtn.addEventListener("click", createGroup);
