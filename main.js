const firebaseConfig = {
  apiKey: "AIzaSyBw0PH0pbur1pFP_-fTXmv2YN-19m5TD_c",
  authDomain: "chat-98657.firebaseapp.com",
  databaseURL: "https://chat-98657-default-rtdb.firebaseio.com",
  projectId: "chat-98657",
  storageBucket: "chat-98657.appspot.com",
  messagingSenderId: "201602061907",
  appId: "1:201602061907:web:c9c3c61d035f44391998a6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// var username = document.getElementById("usernameInput").value;
// var password = document.getElementById("passwordInput").value;
checkCookie();
function checkpass() {
  var username = document.getElementById("usernameInput").value;
  var password = document.getElementById("passwordInput").value;
  var confirmPassword = document.getElementById("confirm").value;
  console.log(confirmPassword, password);
  var message = document.getElementById("message_alert");

  var uppercaseRegex = /[A-Z]/;
  var numberRegex = /[0-9]/;
  var spaceRegex = /\s/; // Regular expression to check for spaces

  if (isEmptyOrWhitespace(username)) {
    message.style.display = "block";
    message.innerHTML = "*Username cannot be empty.";
  } else {
    if (password.length < 8) {
      message.style.display = "block";
      message.innerHTML = "*Password should be at least 8 characters long.";
    } else if (spaceRegex.test(password)) {
      message.style.display = "block";
      message.innerHTML = "*Password should not contain spaces.";
    } else if (!uppercaseRegex.test(password)) {
      message.style.display = "block";
      message.innerHTML =
        "*Password should contain at least one uppercase letter.";
    } else if (!numberRegex.test(password)) {
      message.style.display = "block";
      message.innerHTML = "*Password should contain at least one number.";
    } else {
      signup();
    }
  }
}

function isEmptyOrWhitespace(input) {
  return !input || !input.trim();
}

function signup() {
  username = document.getElementById("usernameInput").value;
  password = document.getElementById("passwordInput").value;
  // Check if the username already exists in Firebase
  firebase
    .database()
    .ref("/" + username)
    .once("value")
    .then(function (snapshot) {
      var userData = snapshot.val();
      if (userData) {
        alert("*Username already exists");
      } else {
        // Username is available, proceed with signup & Save user credentials to Firebase Realtime Database
        firebase
          .database()
          .ref("/" + username)
          .set({
            username: username,
            password: password,
          })
          .then(function () {
            saveCredentials(username, password);
            document.getElementById("field1").style.display = "none";
            document.getElementById("field2").style.display = "none";
            document.getElementById("confirm").style.display = "none";
            document.getElementById("signinbtn").innerHTML = "Sign Up";
            document.getElementById("signinbtn").style.display = "none";
            document.getElementById("btn_img_next_skip").style.display =
              "block";
            document.getElementById("userIdDisplay").style.display = "block";
            document.getElementById("btn_img_next_skip").style.display =
              "block";
            document.getElementById("askloginsign").style.display = "none";
            document.getElementById("container_edit").style.display = "block";
            document.getElementById("signinbtn").id = "btn_img_next";
            localStorage.setItem("username", username);
          })
          .catch((error) => {
            alert("Error occurred while signing up: " + error.message);
          });
      }
    })
    .catch(function (error) {
      alert(
        "Error occurred while checking username availability: " + error.message
      );
    });
}

// Cookie Managment------------------------------------------------------------------------------------------------------------
// Function to retrieve a cookie by name
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function checkCookie() {
  var existingUsername = getCookie("username");
  var existingPassword = getCookie("password");
  var existingOption = getCookie("rememberMe");
  if (existingUsername) {
    document.getElementById("logemail").value = existingUsername;
    document.getElementById("logpass").value = existingPassword;
  }
  // if (existingOption == "On") {
  //   document.getElementById("rememberCheck").value = "tur";
  // }
}

// function input_check(){
//   console.log("dfg")
//   document.getElementById("rememberCheck").click;
//   if (document.getElementById("rememberCheck").value == "True") {
//     document.getElementById("rememberCheck").value == "False"
//   } else if (document.getElementById("rememberCheck").value == "False") {
//     document.getElementById("rememberCheck").value == "True"
//   }
// }

function saveCredentials(username, password) {
  document.cookie =
    "username=" +
    username +
    "; expires=" +
    new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie =
    "password=" +
    password +
    "; expires=" +
    new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  console.log("Credentials saved with username: " + username);
}

// function saveCredentials_log(username, password) {
//   // Check if there are existing username and password cookies
//   var existingUsername = getCookie("username");
//   var existingPassword = getCookie("password");

//   // If existing cookies exist, remove them
//   if (existingUsername) {
//     document.cookie =
//       "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//   }
//   if (existingPassword) {
//     document.cookie =
//       "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//   }

//   // Save the new username and password as cookies
//   document.cookie =
//     "username=" +
//     username +
//     "; expires=" +
//     new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toUTCString();
//   document.cookie =
//     "password=" +
//     password +
//     "; expires=" +
//     new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toUTCString();

//   // Print message on the console
//   console.log(
//     "Credentials saved with username: " +
//       username +
//       " and password: " +
//       password
//   );
// }

// Add an event listener to the div#edit element
document.getElementById("edit").addEventListener("click", function () {
  // Create an input element of type file
  var input = document.getElementById("files");

  // Add an event listener to handle file selection
  input.addEventListener("change", function (event) {
    // Get the selected file
    var file = event.target.files[0];

    // Check if a file is selected
    if (file) {
      // Create a FileReader object to read the selected file
      var reader = new FileReader();

      // Set up the FileReader onload function
      reader.onload = function (e) {
        // Update the src attribute of the img tag with the selected image URL
        document.getElementById("my_img").src = e.target.result;
      };
      document.getElementById("btn_img_next").style.display = "block";
      // Read the selected file as a data URL
      reader.readAsDataURL(file);
    }
  });

  // Trigger a click event on the input element to open the file selection dialog
  input.click();
});

function uploadImage() {
  var fileInput = document.getElementById("files");

  // Check if files are selected
  if (fileInput.files.length > 0) {
    var file = fileInput.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var imageDataUrl = event.target.result;
        // Save the image data URL to the database with the specified file name
        saveImageToDatabase(imageDataUrl);
        console.log("Image uploaded successfully.");
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected.");
    }
  } else {
    console.log("No file selected.");
  }
}

function saveImageToDatabase(imageDataUrl) {
  firebase
    .database()
    .ref("/" + username)
    .update({
      imageDataUrl: imageDataUrl,
    })
    .then(() => {
      console.log("Image data URL saved to the database successfully.");
      window.location = "loading.html";
    })
    .catch((error) => {
      console.error("Error saving image data URL to the database:", error);
    });
}

function showHidePass() {
  var passwordInput = document.querySelector(".loginInput");
  var showeye = document.getElementById("show");
  var hideeye = document.getElementById("hide");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    showeye.style.display = "none";
    hideeye.style.display = "block";
  } else {
    passwordInput.type = "password";
    showeye.style.display = "block";
    hideeye.style.display = "none";
  }
}

function showHidePassc() {
  var passwordInput = document.getElementById("confirmPass");
  var showeye = document.getElementById("showc");
  var hideeye = document.getElementById("hidec");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    showeye.style.display = "none";
    hideeye.style.display = "block";
  } else {
    passwordInput.type = "password";
    showeye.style.display = "block";
    hideeye.style.display = "none";
  }
}

function showHidePassl() {
  var passwordInput = document.getElementById("logpass");
  var showeye = document.getElementById("showl");
  var hideeye = document.getElementById("hidel");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    showeye.style.display = "none";
    hideeye.style.display = "block";
  } else {
    passwordInput.type = "password";
    showeye.style.display = "block";
    hideeye.style.display = "none";
  }
}

// login-----------------------------------------------------------
function login() {
  var username = document.getElementById("logemail").value;
  var password = document.getElementById("logpass").value;
  var message = document.getElementById("message_alert");

  // Check if username is empty
  if (!username) {
    message.style.display = "block";
    message.innerText = "*Username cannot be empty";
    return; // Exit the function early if username is empty
  }

  // Check if the username exists in the Firebase database
  firebase
    .database()
    .ref("/" + username) // Ensure username is properly formatted as a path
    .once("value")
    .then(function (snapshot) {
      var userData = snapshot.val();
      if (userData) {
        // Username exists, check if the password matches
        if (userData.password === password) {
          // Password matches, proceed with login
          console.log("Login successful!");
          saveCredentials(username, password);
          console.log("info. saved");
          window.location = "loading.html";
        } else {
          message.style.display = "block";
          message.innerHTML = "*Invalid password";
        }
      } else {
        message.style.display = "block";
        message.innerHTML = "*Username dosen't exist";
      }
    })
    .catch(function (error) {
      // Handle errors
      alert("Error occurred while logging in: " + error.message);
    });
}

function skip() {
  window.location;
}

// Function to retrieve a cookie by name
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function signupformat() {
  document.getElementById("mainText").style.color = "transparent";
  setTimeout(() => {
    document.getElementById("mainText").style.color = "#dcdbdb";
    document.getElementById("mainText").innerHTML = "Sign Up Form";
  }, 200);

  document.getElementById("confirm").style.display = "flex";
  document.getElementById("checkbox_container").style.display = "none";
  setInterval(() => {
    document.getElementById("confirm").style.opacity = "1";
    document.getElementById("confirm").style.transition = "0.3s";
    document.getElementById("confirm").style.marginTop = "20px";
  }, 0);

  document.getElementById("loginbtn").style.color = "transparent";
  setTimeout(() => {
    document.getElementById("loginbtn").style.color = "#c9c7c7";
    document.getElementById("loginbtn").innerHTML = "Next >";
    document.getElementById("loginbtn").id = "signinbtn";
    clearInterval();
  }, 100);

  document.getElementById("askloginsign").innerHTML =
    "Already signed in ? <a onclick='loginformat()'>Login</a>";

  document.getElementById("logemail").id = "usernameInput";
  document.getElementById("logpass").id = "passwordInput";
  // document.getElementById("loginbtn").id="signinbtn";
}

function loginformat() {
  document.getElementById("mainText").style.color = "transparent";
  setTimeout(() => {
    document.getElementById("mainText").style.color = "#dcdbdb";
    document.getElementById("mainText").innerHTML = "Login Form";
  }, 200);

  document.getElementById("confirm").style.display = "none";
  document.getElementById("confirm").style.transition = "0.3s";
  document.getElementById("confirm").style.marginTop = "-50px";
  document.getElementById("checkbox_container").style.display = "flex";

  document.getElementById("signinbtn").style.color = "transparent";
  setTimeout(() => {
    document.getElementById("signinbtn").style.color = "#c9c7c7";
    document.getElementById("signinbtn").innerHTML = "Login";
    document.getElementById("signinbtn").id = "loginbtn";
    clearInterval();
  }, 100);

  document.getElementById("askloginsign").innerHTML =
    "Not a member? <a onclick='signupformat()'>signup now</a>";

  document.getElementById("usernameInput").id = "logemail";
  document.getElementById("passwordInput").id = "logpass";
  // document.getElementById("signinbtn").id="loginbtn";
}

function checkClick(clicked_id, event) {
  event.preventDefault();
  if (clicked_id == "loginbtn") {
    login();
  } else if (clicked_id == "signinbtn") {
    checkpass();
  } else if (clicked_id == "btn_img_next") {
    uploadImage();
  }
}
