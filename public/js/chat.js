//DOM elements
const messageTextArea = document.getElementById("messageTextArea");
const messageSendBtn = document.getElementById("messageSendBtn");
const uiGroup = document.getElementById("groups");
const groupNameHeading = document.getElementById("groupNameHeading");
const socket = io("http://localhost:5000");

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
  getMessages();
}

async function messageSend(e) {
  e.preventDefault();
  try {
    //Remove existing group members display in the chat box if present
    const members = chatBoxBody.querySelectorAll(".groupMembersDiv");

    // Check if there are any members to remove
    if (members.length > 0) {
      members.forEach((member) => {
        member.remove();
      });
    }
    // Get the message content, authentication token, and group name
    const message = messageTextArea.value;
    const token = localStorage.getItem("token");
    const groupName = localStorage.getItem("groupName");

    // Check if a group is selected before sending the message
    if (!groupName || groupName === "") {
      return alert("Select group to send the message");
    }
    // Send a POST request to the server to send the message to the selected group
    const res = await axios.post(
      "http://localhost:3000/chat/sendMessage",
      {
        message: message,
        groupName: groupName,
      },
      {
        headers: { Authorization: token },
      }
    );

    // Clear the message input area and refresh the displayed messages
    messageTextArea.value = "";
    getMessages();
  } catch (err) {
    console.log(err);
  }
}

// Decode an encoded JWT (JSON Web Token) to extract the payload
// JWTs consist of three parts: header, payload, and signature, separated by dots
// This function decodes the payload, which is the second part of the JWT
function decodeToken(token) {
  // Extract the base64-encoded payload from the JWT
  const base64Url = token.split(".")[1];

  // Replace characters to make it a valid base64 string
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  // Decode the base64 string to get the JSON-formatted payload
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        // Convert each character to its UTF-8 representation
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  // Parse the JSON payload to obtain a JavaScript object
  return JSON.parse(jsonPayload);
}

async function getMessages() {
  //get token from localstorage
  const token = localStorage.getItem("token");

  //helper function decodes the token
  const decodedToken = decodeToken(token);

  //extract userId from decoded token
  const userId = decodedToken.userId;

  //get groupName from localStorage
  const groupName = localStorage.getItem("groupName");

  //emit the message which will receive by the server (chatController)
  socket.emit("getMessages", groupName);

  //receive the broadcast by the server (chatController)
  // Iterate through the received messages and manipulate the DOM accordingly
  socket.on("messages", (messages) => {
    chatBoxBody.innerHTML = "";
    messages.forEach((message) => {
      // Check if the message was sent by the current user
      if (message.userId == userId) {
        // DOM manipulation for messages sent by the current user
        const div = document.createElement("div");
        chatBoxBody.appendChild(div);

        const messageSendby = document.createElement("span");
        messageSendby.classList.add(
          "d-flex",
          "justify-content-end",
          "px-3",
          "mb-1",
          "text-uppercase",
          "small",
          "text-white"
        );
        messageSendby.appendChild(document.createTextNode("You"));
        div.appendChild(messageSendby);

        const messageBox = document.createElement("div");
        const messageText = document.createElement("div");

        messageBox.classList.add("d-flex", "justify-content-end", "mb-4");

        messageText.classList.add("msg_cotainer_send");
        messageText.appendChild(document.createTextNode(message.message));

        messageBox.appendChild(messageText);
        div.appendChild(messageBox);
      } else {
        // DOM manipulation for messages sent by other users
        const div = document.createElement("div");
        chatBoxBody.appendChild(div);

        const messageSendby = document.createElement("span");
        messageSendby.classList.add(
          "d-flex",
          "justify-content-start",
          "px-3",
          "mb-1",
          "text-uppercase",
          "small",
          "text-white"
        );
        messageSendby.appendChild(document.createTextNode(message.name));
        div.appendChild(messageSendby);

        const messageBox = document.createElement("div");
        const messageText = document.createElement("div");

        messageBox.classList.add("d-flex", "justify-content-start", "mb-4");

        messageText.classList.add("msg_cotainer");
        messageText.appendChild(document.createTextNode(message.message));

        messageBox.appendChild(messageText);
        div.appendChild(messageBox);
      }
    });
  });
}

//event listeners
messageSendBtn.addEventListener("click", messageSend);
uiGroup.addEventListener("click", activeGroup);
document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("groupName", "");
  localStorage.setItem("chats", JSON.stringify([]));
});
