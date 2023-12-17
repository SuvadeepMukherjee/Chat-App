//DOM elements
const email = document.getElementById("email");
const password = document.getElementById("password");
const backendResponse = document.getElementById("backend-response");

/*
-Extracts values and send a POST request to the endpoint /signUp
-Redirects to login page on succesfull login(200)
-Sends a error message on 409 status(conflict)
*/
async function loginUser(event) {
  event.preventDefault();
  try {
    //extract values from form inputs
    const emailValue = email.value;
    const passwordValue = password.value;

    //create user object
    const obj = {
      emailValue,
      passwordValue,
    };

    const response = await axios.post("http://localhost:3000/user/login", obj);

    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);
      alert("You are succesfully logged in to your account");
      //window.location.href = "/user/login";
    }
  } catch (err) {
    console.log(err);
    if (err.response.status === 401) {
      backendResponse.innerHTML = "Incorrect Password";
    } else if (err.response.status === 404) {
      backendResponse.innerHTML = "User does not exist";
    } else if (err.response.status === 500) {
      backendResponse.innerHTML = "Server Error";
    }
  }
}

//event listeners
document.getElementById("form").addEventListener("submit", loginUser);
