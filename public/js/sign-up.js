//DOM elements
const name = document.getElementById("namee");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const backendResponse = document.getElementById("backend-response");

/*
-Extracts values and send a POST request to the endpoint /signUp
-Redirects to login page on succesfull login(200)
-Sends a error message on 409 status(conflict)
*/
async function createUser(event) {
  event.preventDefault();
  try {
    //extract values from form inputs
    const nameValue = namee.value;
    const emailValue = email.value;
    const phoneValue = phone.value;
    const passwordValue = password.value;

    //create user object
    const obj = {
      nameValue,
      emailValue,
      phoneValue,
      passwordValue,
    };

    const response = await axios.post("http://localhost:3000/user/signup", obj);

    if (response.status === 200) {
      window.location.href = "/user/login";
    }
  } catch (err) {
    console.log(err);
    if (err.response.status === 409) {
      backendResponse.innerHTML = "Email or password already exists";
    }
  }
}

//event listeners
document.getElementById("form").addEventListener("submit", createUser);
