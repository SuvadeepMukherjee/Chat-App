//DOM elements
const messageTextArea = document.getElementById("messageTextArea");
const messageSendBtn = document.getElementById("messageSendBtn");
const uiGroup = document.getElementById("groups");

async function activeGroup(e) {
  //Clear the chat box body
  chatBoxBody.innerHTML = "";

  //Reset the stored chats in local storage
  localStorage.setItem("chats", JSON.stringify());

  //Clear the group name heading
  groupNameHeading.innerHTML = "";

  //Remove the 'active' class from any previously active list item
  const activeLi = document.getElementsByClassName("active");
  if (activeLi.length !== 0) {
    activeLi[0].removeAttribute("class", "active");
  }

  //Find the closest list item (li) element from the target element in the event
  let li = e.target;
  while (li.tagName !== "LI") {
    li = li.parentElement;
  }

  //set the active class for the clicked list item
  li.setAttribute("class", "active");

  //Extract the group name from the clicked list item
  const groupName = li.querySelector("span").textContent;

  //Store the selected group nam in local storage
  localStorage.setItem("groupName", groupName);

  //Create a new span element with the group name and append it to the group name heading
  const span = document.createElement("span");
  span.appendChild(document.createTextNode(groupName));
  groupNameHeading.appendChild(span);

  //Call the function to fetch and display messages for the selected group
  //getMessages();
}

async function messageSend() {
  try {
    const token = localStorage.getItem("token");
    const message = messageTextArea.value;

    const res = await axios.post(
      "http://localhost:3000/chat/sendMessage",
      {
        message: message,
      },
      { headers: { Authorization: token } }
    );
    messageTextArea.value = "";
  } catch (err) {
    console.log("Something went wrong with sending messages", err);
  }
}

//event listeners
messageSendBtn.addEventListener("click", messageSend);
uiGroup.addEventListener("click", activeGroup);
document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("groupName", "");
  localStorage.setItem("chats", JSON.stringify([]));
});
