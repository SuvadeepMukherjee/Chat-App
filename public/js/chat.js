//DOM elements
const messageTextArea = document.getElementById("messageTextArea");
const messageSendBtn = document.getElementById("messageSendBtn");

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
