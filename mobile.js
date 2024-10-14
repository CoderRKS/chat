const body = document.querySelector("body");
const sidebar = body.querySelector("nav");
const toggle = body.querySelector(".toggle");
const searchBtn = body.querySelector(".search-box");
const modeSwitch = body.querySelector(".toggle-switch");
const modeText = body.querySelector(".mode-text");
const roomHome = document.getElementById("home");
const roomHomeBtn = document.getElementById("roomHomeBtn");
const roomDetailsBtn = document.getElementById("roomDetailsBtn");
const roomDetailsSection = document.getElementById("roomDetailsSection");
var room_name = localStorage.getItem("room_name");
var ImgName, ImgUrl;
var files = [];
var reader = new FileReader();
var savedUsername = getSavedUsername();
var sendSound = document.getElementById("sendsound");
var getSound = document.getElementById("getsound");
getSound.volume = 0.3;
sendSound.volume = 0.3;

const firebaseConfig = {
  apiKey: "AIzaSyDr1-gy1vViN3ULBTp5cJUBZ1NxAeJHHRA",
  authDomain: "userdata-e7a6c.firebaseapp.com",
  databaseURL: "https://userdata-e7a6c-default-rtdb.firebaseio.com",
  projectId: "userdata-e7a6c",
  storageBucket: "userdata-e7a6c.appspot.com",
  messagingSenderId: "1010009740328",
  appId: "1:1010009740328:web:0961c85f6764ff0900111d",
};

const firebaseConfig_cr = {
  apiKey: "AIzaSyDEllX7oXAp7VtJOGdzzspyNn_zBSg7E4A",
  authDomain: "gochat-f7f8e.firebaseapp.com",
  databaseURL: "https://gochat-f7f8e-default-rtdb.firebaseio.com",
  projectId: "gochat-f7f8e",
  storageBucket: "gochat-f7f8e.appspot.com",
  messagingSenderId: "291053085887",
  appId: "1:291053085887:web:e22b7a1e2f71ca75e0520a",
};

const firebaseApp_main = firebase.initializeApp(firebaseConfig);
const firebaseApp_other = firebase.initializeApp(firebaseConfig_cr, "other");

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
}
document.getElementById("my_pro_text").innerHTML = savedUsername;
document.getElementById("test_user_pro").innerText = savedUsername;

var spanElement = document.getElementById("span_hello");

function getSavedUsername() {
  var username = "";
  var cookies = document.cookie.split(";");
  cookies.forEach((cookie) => {
    var parts = cookie.split("=");
    if (parts[0].trim() === "username") {
      username = parts[1];
    }
  });
  checkDarkModePreference();
  return username;
}

user_img();

function checkDarkModePreference() {
  const darkModePreference = getCookie("darkMode");
  if (darkModePreference === "true") {
    document.body.classList.add("dark");
    document.querySelector(".mode-text").innerText = "Light mode";
  } else {
    document.body.classList.remove("dark");
    document.querySelector(".mode-text").innerText = "Dark mode";
  }
}

var finalTime;
setInterval(() => {
  var dt = new Date();
  var hours = dt.getHours() % 12 || 12;
  var AmOrPm = dt.getHours() >= 12 ? "PM" : "AM";
  var minutes = dt.getMinutes().toString().padStart(2, "0");
  finalTime = hours + ":" + minutes + " " + AmOrPm;
  // document.getElementById("timetext").innerHTML = finalTime;
}, 1000);

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    modeText.innerText = "Light mode";
    setCookie("darkMode", "true", 30);
  } else {
    modeText.innerText = "Dark mode";
    setCookie("darkMode", "false", 30);
  }
});

// function getData() {
//   room_name = localStorage.getItem("room_name");
//   document.getElementById("ad").style.display = "none";
//   document.getElementById("output").style.display = "block";
//   var name_of_user = room_name.replace(savedUsername, "");
//   document.getElementById("name_to_be_displayed").innerHTML = name_of_user;
//   show_user_pro_pic();
//   firebaseApp_other
//     .database()
//     .ref(room_name)
//     .on("value", function (snapshot) {
//       const output = document.getElementById("output");
//       output.innerHTML = "";
//       let previousSender = "";
//       snapshot.forEach(function (childSnapshot) {
//         const childData = childSnapshot.val();
//         const messageType = childData.type;

//         if (messageType === "Audio") {
//           const audioElement = childData.message;
//           const time_get = childData.time;
//           const name = childData.name;
//           const isCurrentUser = name === savedUsername;
//           const alignment = isCurrentUser ? "right-align2" : "left-align2";
//           const alignmentClass = isCurrentUser ? "right-align" : "left-align";
//           const alignment_time = isCurrentUser
//             ? "left-align-time"
//             : "right-align-time";
//           const border_align = isCurrentUser
//             ? "20px 5px 20px 20px"
//             : "5px 20px 20px 20px";
//           const border_for_name =
//             name === previousSender ? "20px 20px 20px 20px" : border_align;
//           const marginStyle =
//             name === previousSender ? "margin-top: -4px;" : "";

//           const messageHTML =
//             "<div class='main_msg_contain_audio " +
//             alignmentClass +
//             "' style='" +
//             marginStyle +
//             "'>" +
//             "<div class='msg_contain_audio " +
//             alignment +
//             " ' style='border-radius: " +
//             border_for_name +
//             ";' >" +
//             "<audio class='audio_play' controls src='" +
//             audioElement +
//             "'></audio>" +
//             "<p class='time_given " +
//             alignment_time +
//             "'>" +
//             time_get +
//             "</p>" +
//             "</div>" +
//             "</div>" +
//             "<br>";
//           output.innerHTML += messageHTML;
//           previousSender = name;
//         } else if (messageType === "image") {
//           const imageElement = childData.message;
//           const time_get = childData.time;
//           const img_name = childData.nameimage;
//           const name = childData.name;
//           const isCurrentUser = name === savedUsername;
//           const alignmentClass = isCurrentUser ? "right-align" : "left-align";
//           const alignment_time = isCurrentUser
//             ? "left-align-time"
//             : "right-align-time";
//           const marginStyle =
//             name === previousSender ? "margin-top: -4px;" : "";
//           const borderRadius =
//             name === savedUsername ? "20px" : "0px 20px 20px 20px";

//           const messageHTML =
//             "<div class='main_msg_contain_img " +
//             alignmentClass +
//             "' style='" +
//             marginStyle +
//             "'>" +
//             "<div class='msg_contain_audio' " +
//             " style='border-radius: " +
//             borderRadius +
//             ";'>" +
//             "<img onclick='pop_img(this.src)' class='msg_contain_img' src = '" +
//             imageElement +
//             "' alt = '" +
//             img_name +
//             "' style = ' height:180px; border-radius:20px; margin-right:0px' >" +
//             "<p class='time_given " +
//             alignment_time +
//             "'>" +
//             time_get +
//             "</p>" +
//             "</div>" +
//             "</div>" +
//             "<br>";
//           output.innerHTML += messageHTML;
//           previousSender = name;
//         } else if (childData.message) {
//           const name = childData.name;
//           const message = childData.message;
//           const time_get = childData.time;
//           const isCurrentUser = name === savedUsername;
//           const alignmentClass = isCurrentUser ? "right-align" : "left-align";
//           const alignment = isCurrentUser ? "right-align2" : "left-align2";
//           const alignment_time = isCurrentUser
//             ? "left-align-time"
//             : "right-align-time";
//           const marginStyle =
//             name === previousSender ? "margin-top: -4px;" : "";
//           const border_align = isCurrentUser
//             ? "20px 5px 20px 20px"
//             : "5px 20px 20px 20px";
//           const border_for_name =
//             name === previousSender ? "20px 20px 20px 20px" : border_align;
//           const messageHTML =
//             "<div class='main_msg_contain " +
//             alignmentClass +
//             "' style='" +
//             marginStyle +
//             "'>" +
//             "<div class='msg_contain " +
//             alignment +
//             " ' style='border-radius: " +
//             border_for_name +
//             ";' >" +
//             " <span class='message_text'>" +
//             message +
//             "</span> " +
//             "<p class='time_given " +
//             alignment_time +
//             "'>" +
//             time_get +
//             "</p>";
//           "</div>" + "</div>" + "<br>";

//           output.innerHTML += messageHTML;

//           previousSender = name;
//         }
//       });
//       output.scrollTop = output.scrollHeight;
//     });
// }

// Main chat function for user load, chat load etc.- -------------------->
function getData() {
  // showall();
  room_name = localStorage.getItem("room_name");
  document.getElementById("ad").style.display = "none";
  document.getElementById("output").style.display = "block";
  var name_of_user = room_name.replace(savedUsername, "");
  document.getElementById("name_to_be_displayed").innerHTML = name_of_user;
  show_user_pro_pic();
  firebaseApp_other
    .database()
    .ref(room_name)
    .on("value", function (snapshot) {
      const output = document.getElementById("output");
      output.innerHTML = "";
      let previousSender = "";
      snapshot.forEach(function (childSnapshot) {
        const childData = childSnapshot.val();
        const messageType = childData.type;

        const name_of_sender = childData.name;
        const time_get = childData.time;
        const isCurrentUser = name_of_sender === savedUsername;
        const alignment_time = isCurrentUser
          ? "left-align-time"
          : "right-align-time";
        const marginStyle =
          name_of_sender === previousSender ? "margin-top: -4px;" : "";

        const alignment = isCurrentUser ? "right-align2" : "left-align2";
        const alignmentClass = isCurrentUser ? "right-align" : "left-align";
        const border_align = isCurrentUser
          ? "20px 5px 20px 20px"
          : "5px 20px 20px 20px";
        const border_for_name =
          name_of_sender === previousSender
            ? "20px 20px 20px 20px"
            : border_align;

        if (messageType === "Audio") {
          const audioElement = childData.message;

          const messageHTML =
            "<div class='main_msg_contain_audio " +
            alignmentClass +
            "' style='" +
            marginStyle +
            "'>" +
            "<div class='msg_contain_audio " +
            alignment +
            " ' style='border-radius: " +
            border_for_name +
            ";' >" +
            "<audio class='audio_play' controls src='" +
            audioElement +
            "'></audio>" +
            "<p class='time_given " +
            alignment_time +
            "'>" +
            time_get +
            "</p>" +
            "</div>" +
            "</div>" +
            "<br>";
          output.innerHTML += messageHTML;
          previousSender = name_of_sender;
        } else if (messageType === "image") {
          const imageElement = childData.message;
          const img_name = childData.nameimage;
          const messageHTML =
            "<div class='main_msg_contain_img " +
            alignmentClass +
            "' style='" +
            marginStyle +
            "'>" +
            "<div class='msg_contain_audio' " +
            " style='border-radius: " +
            border_for_name +
            ";'>" +
            "<img onclick='pop_img(this.src)' class='msg_contain_img' src = '" +
            imageElement +
            "' alt = '" +
            img_name +
            "' style = ' height:180px; border-radius:20px; margin-right:0px' >" +
            "<p class='time_given " +
            alignment_time +
            "'>" +
            time_get +
            "</p>" +
            "</div>" +
            "</div>" +
            "<br>";
          output.innerHTML += messageHTML;
          previousSender = name_of_sender;
        } else if (childData.message) {
          const message = childData.message;
          const messageHTML =
            "<div class='main_msg_contain " +
            alignmentClass +
            "' style='" +
            marginStyle +
            "'>" +
            "<div class='msg_contain " +
            alignment +
            " ' style='border-radius: " +
            border_for_name +
            ";' >" +
            " <span class='message_text'>" +
            message +
            "</span> " +
            "<p class='time_given " +
            alignment_time +
            "'>" +
            time_get +
            "</p>";
          "</div>" + "</div>" + "<br>";

          output.innerHTML += messageHTML;

          previousSender = name_of_sender;
        }
      });
      output.scrollTop = output.scrollHeight;
    });
}

function send() {
  msg = document.getElementById("msg").value.trim();
  var room_name = localStorage.getItem("room_name");
  if (msg.length > 0 && msg != "") {
    firebaseApp_other.database().ref(room_name).push({
      name: savedUsername,
      message: msg,
      time: finalTime,
    });
    document.getElementById("msg").value = "";
  } else {
    console.log("Message cannot be empty");
  }
  previousSender = name;
  // sendSound.play();
}

document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    send();
  }
});

function retrieveImage() {
  console.log("Retrieving latest image...");

  var imagesRef = firebaseApp_other
    .database()
    .ref(room_name + "images")
    .orderByKey()
    .limitToLast(1);
  console.log("Entering 'images' folder in the database...");

  imagesRef
    .once("value")
    .then(function (snapshot) {
      console.log("Data retrieved from 'images' folder:");

      snapshot.forEach(function (childSnapshot) {
        var imageDataUrl = childSnapshot.val().imageDataUrl;
        if (imageDataUrl) {
          console.log("Latest image found:", imageDataUrl);

          console.log("Sending latest image URL to chat room...");
          firebaseApp_other
            .database()
            .ref(room_name)
            .push({
              name: savedUsername,
              message: imageDataUrl,
              time: finalTime,
              type: "image",
            })
            .then(() => {
              console.log("Image URL sent to chat successfully.");
            })
            .catch((error) => {
              console.error("Error sending image URL to chat:", error);
            });
        } else {
          console.log("Latest image URL is undefined.");
        }
      });
    })
    .catch(function (error) {
      console.error("Error retrieving image:", error);
    });
}

function clickattach() {
  console.log("file clicked");

  var input = document.getElementById("files");
  input.type = "file";
  input.onchange = (e) => {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popup").style.top = "0px";
    files = e.target.files;
    reader = new FileReader();
    reader.onload = function () {
      document.getElementById("myimg").src = reader.result;
    };
    reader.readAsDataURL(files[0]);
  };
  input.click();
}

function uploadImage() {
  var fileInput = document.getElementById("files");

  if (fileInput.files.length > 0) {
    var file = fileInput.files[0];
    var fileName = file.name.split(".").slice(0, -1).join(".");
    console.log(fileName);
    if (file) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var imageDataUrl = event.target.result;
        saveImageToDatabase(imageDataUrl, fileName);
        console.log("Image uploaded successfully.");
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected.");
    }
  } else {
    console.log("No file selected.");
  }
  document.getElementById("overlay").style.display = "none";
  retrieveImage();
}

function saveImageToDatabase(imageDataUrl, fileName, time) {
  firebaseApp_other
    .database()
    .ref(room_name + "images")
    .push({
      imageDataUrl: imageDataUrl,
      nameimage: fileName,
      time: finalTime,
    })
    .then(() => {
      console.log("Image data URL saved to the database successfully.");
    })
    .catch((error) => {
      console.error("Error saving image data URL to the database:", error);
    });
}

// document.addEventListener("keydown", function (event) {
//   if (event.key === "Escape" || event.keyCode === 27 || event.which === 27) {
//     cancelImage();
//     document.getElementById("overlay_img").style.display = "none";
//   }
// });

function cancelImage() {
  document.getElementById("overlay").style.display = "none";
}

function pop_img(imageUrl) {
  document.getElementById("myimg_image").src = imageUrl;
  console.log(window.innerHeight)
  if (document.getElementById("myimg_image").height > window.innerHeight){
    document.getElementById("myimg_image").height = window.innerHeight - 140;
  } //else{
  //   document.getElementById("myimg_image").height = "auto";
    
  // }
  document.getElementById("overlay_img").style.display = "block";
}

function getUsers() {
  firebase
    .database()
    .ref("/")
    .once("value")
    .then(function (snapshot) {
      const userOutput = document.getElementById("user_output");
      userOutput.innerHTML = "";

      snapshot.forEach(function (childSnapshot) {
        var userID = childSnapshot.key;
        var userimg = childSnapshot.val().imageDataUrl;
        if (userID !== savedUsername) {
          document.getElementById("user_img").src = userimg;
          // Check if it's not the current user's ID
          const userHTML =
            "<div class='user_flex'><img src='" +
            userimg +
            "' class='img_pro_pic_users'>" +
            "<p class='user_name_id' onclick='createChat(this.innerText)'>" +
            userID +
            "</p></div>";
          userOutput.innerHTML += userHTML;
        }
      });
    })
    // .then(() => {
    //   retrieveImage_log();
    // })
    .catch(function (error) {
      console.error("Error retrieving user data:", error);
    });
}

function show_user_pro_pic() {
  var pro_pic_user = room_name.replace(savedUsername, "");
  firebaseApp_main
    .database()
    .ref(pro_pic_user)
    .once("value")
    .then(function (snapshot) {
      var user_pic = snapshot.val().imageDataUrl; // Access snapshot directly
      document.getElementById("user_img").src = user_pic;
    })
    .catch(function (error) {
      console.error("Error fetching user image data:", error);
    });
}

function user_img() {
  firebase
    .database()
    .ref("/")
    .once("value")
    .then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.key === savedUsername) {
          const userimg = childSnapshot.val().imageDataUrl;
          document.getElementById("user_img").src = userimg;
          document.getElementById("my_pro_logo").src = userimg;
        }
      });
    })
    .catch(function (error) {
      console.error("Error retrieving user data:", error);
    });
}

getUsers();

// function createChat(userID) {
//   var sender = userID;
//   var newRoomName = sender + "_" + savedUsername;
//   firebaseApp_other
//     .database()
//     .ref("/")
//     .child(newRoomName)
//     .update({
//       purpose: "adding room name",
//     })
//     .then(() => {
//       localStorage.setItem("room_name", newRoomName);
//       console.log("New room name saved to localStorage:", newRoomName);
//       room_name = localStorage.getItem("room_name");
//       console.log("Updated room name:", room_name);
//       getData();
//     });
// }

function createChat(userID) {
  console.log("createChatStarted");
  var sender = savedUsername;
  var receiver = userID;
  var room_name1 = sender + receiver;
  var room_name2 = receiver + sender;
  // Check if the chat room already exists
  firebaseApp_other
    .database()
    .ref("/")
    .once("value")
    .then(function (snapshot) {
      if (snapshot.hasChild(room_name1)) {
        // If the chat room already exists with sender-receiver order
        navigateToChat(room_name1);
        openChat();
      } else if (snapshot.hasChild(room_name2)) {
        // If the chat room already exists with receiver-sender order
        navigateToChat(room_name2);
        openChat();
      } else {
        // If the chat room doesn't exist, create a new one
        firebaseApp_other
          .database()
          .ref("/")
          .child(room_name1)
          .update({
            purpose: "adding room name",
          })
          .then(() => {
            localStorage.setItem("room_name", room_name1);
            navigateToChat(room_name1);
            openChat();
            console.log("output");
          });
      }
    })
    .then(() => {
      show_user_pro_pic();
    })
    .catch(function (error) {
      console.error("Error checking if chat room exists:", error);
    });
}

function navigateToChat(roomName) {
  localStorage.setItem("room_name", roomName);
  console.log(localStorage.getItem("room_name"));
  getData();
}

const cards = document.querySelectorAll(".card");
// const onDocumentMouseMoveHandler = (evt) => {
//   evt.preventDefault();

//   requestAnimationFrame(() => {
//     if (!evt.target.closest('.card')) {
//       card.style.transform = 'perspective(1000px) scale(1) rotateX(0) rotateY(0)';
//     }
//   });
// };
// document.addEventListener('mousemove', onDocumentMouseMoveHandler)
cards.forEach((card) => {
  const mouseMoveHandler = (evt) => {
    evt.preventDefault();

    requestAnimationFrame(() => {
      // const xRotation = -30 * ((evt.layerY - height / 2) / height);
      // const yRotation = 20 * ((evt.layerX - width / 2) / width);

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Calculate distance from the center
      const distanceX = evt.clientX - centerX;
      const distanceY = evt.clientY - centerY;

      // Calculate rotation based on distance
      const xRotation = -30 * (distanceY / centerY);
      const yRotation = 20 * (distanceX / centerX);

      console.log(xRotation, yRotation);
      card.style.transform = `perspective(1000px) scale(1.05) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    });
  };

  card.addEventListener("mouseenter", (evt) => {
    evt.preventDefault();
    card.addEventListener("mousemove", mouseMoveHandler);
  });

  card.addEventListener("mouseout", (evt) => {
    evt.preventDefault();
    setTimeout(function () {
      card.style.transform =
        "perspective(1000px) scale(1) rotateX(0) rotateY(0)";
      card.removeEventListener("mousemove", mouseMoveHandler);
    }, 500);
  });

  card.addEventListener("click", (evt) => {
    evt.preventDefault();
    card.style.animation = "spin 1s ease-in-out";
    setTimeout(() => {
      card.style.animation = "";
    }, 1000);
  });
});

function searchUsers() {
  var searchQuery = document.getElementById("search_box").value.toLowerCase();
  var users = document.querySelectorAll(".user_name_id");

  users.forEach(function (user) {
    var userName = user.innerText.toLowerCase();
    var userElement = user.parentElement;

    if (userName.includes(searchQuery)) {
      userElement.style.display = "flex";
    } else {
      userElement.style.display = "none";
    }
  });
}
chatMessages = document.getElementById("output");
chatMessages.addEventListener("scroll", function () {
  if (
    chatMessages.scrollHeight - chatMessages.scrollTop <=
    chatMessages.clientHeight + 1
  ) {
    document.getElementById("down_icon").style.display = "none";
  } else {
    document.getElementById("down_icon").style.display = "block";
  }
});

// Function to scroll to the bottom of the chat messages
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function show_more() {
  document.getElementById("overlay_more").style.display = "block";
}

function deleteChat() {
  document.getElementById("overlay_del").style.display = "block";
  document.getElementById("overlay_more").style.display = "none";
  var del_text = room_name.replace(savedUsername, "");
  var text_to_be_displayed = "Delete Chat with '" + del_text + "' ?";
  document.getElementById("del_text").innerHTML = text_to_be_displayed;
}

function delChat() {
  let chatRef = firebaseApp_other.database().ref(room_name);
  chatRef.remove();
  document.getElementById("overlay_del").style.display = "none";
}

//----------------------------------------------------------------------------------------------------------------------------

let mediaRecorder;
let recordedChunks = [];
const audioElement = document.querySelector("audio");
const visualizerBars = document.querySelectorAll(".bar");

const recordButton = document.getElementById("rec_btn");
const stopButton = document.getElementById("pause_rec_btn");

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
var stream;
var timerInterval;

async function startRecording() {
  document.getElementById("btn_microphone").style.display = "none";
  document.getElementById("send_btn").style.display = "none";
  document.getElementById("upload_btn").style.display = "none";
  document.getElementById("record").style.display = "flex";
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (event) => {
    recordedChunks.push(event.data);
  };

  // Inside the mediaRecorder.onstop event handler
  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(recordedChunks, { type: "audio/wav" });
    mediaRecorder = null;
    recordedChunks = [];
    // Upload the audio recording to Firebase Storage
    const storageRef = firebaseApp_other
      .storage()
      .ref()
      .child("audio/" + new Date().toISOString() + ".wav");
    const uploadTask = storageRef.put(audioBlob);

    // Return a Promise to handle the upload completion
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Error
          console.error("Error uploading audio:", error);
          reject(error);
        },
        () => {
          // Upload completed successfully, resolve the Promise with the download URL
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log("File available at", downloadURL);
            resolve(downloadURL);
            uploadAudio(downloadURL);
          });
        }
      );
    });
  };

  function uploadAudio(downloadURL) {
    firebaseApp_other
      .database()
      .ref(room_name + "Audio")
      .push({
        audioUrl: downloadURL,
      });
    retriveAudio();
  }

  mediaRecorder.start();
  // recordButton.disabled = true;
  // stopButton.disabled = false;
  // completeStopButton.disabled = false;

  // Start audio visualization
  visualizeAudio(stream);

  // JavaScript

  // Variables to hold timer values
  let minutes = 0;
  let seconds = 0;

  // Function to update the timer display
  function updateTimer() {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }

    // Format the timer display
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    // Update the timer display
    document.getElementById("time_rec").textContent = formattedTime;
  }

  // Start the timer
  timerInterval = setInterval(updateTimer, 1000);

  // Example of how to stop the timer after a certain duration (e.g., 5 minutes)
  // setTimeout(() => {
  //
  // }, 300000);
}

function stopRecording() {
  console.log("stop");
  mediaRecorder.stop();
  recordButton.disabled = false;
  stopButton.disabled = true;
  clearInterval(timerInterval);
  document.getElementById("record").style.display = "none";
  document.getElementById("btn_microphone").style.display = "flex";
  document.getElementById("btn_microphone").style.alignItems = "center";
  document.getElementById("btn_microphone").style.justifyContent = "center";
  document.getElementById("send_btn").style.display = "flex";
  document.getElementById("upload_btn").style.display = "flex";
}

function retriveAudio() {
  var imagesRef = firebaseApp_other
    .database()
    .ref(room_name + "Audio")
    .orderByKey()
    .limitToLast(1);
  console.log("Entering 'images' folder in the database...");

  imagesRef
    .once("value")
    .then(function (snapshot) {
      console.log("Data retrieved from 'images' folder:");

      snapshot.forEach(function (childSnapshot) {
        var audioUrl_toUse = childSnapshot.val().audioUrl;
        if (audioUrl_toUse) {
          console.log("Latest image found:", audioUrl_toUse);

          console.log("Sending latest image URL to chat room...");
          firebaseApp_other
            .database()
            .ref(room_name)
            .push({
              name: savedUsername,
              message: audioUrl_toUse,
              time: finalTime,
              type: "Audio",
            })
            .then(() => {
              console.log("Image URL sent to chat successfully.");
            })
            .catch((error) => {
              console.error("Error sending image URL to chat:", error);
            });
        } else {
          console.log("Latest image URL is undefined.");
        }
      });
    })
    .catch(function (error) {
      console.error("Error retrieving image:", error);
    });
}

function visualizeAudio(stream) {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const boxes2 = document.querySelectorAll(".bar2");
  source.connect(analyser);

  function draw() {
    const WIDTH = visualizerBars.length;
    analyser.getByteFrequencyData(dataArray);

    for (let i = 0; i < WIDTH; i++) {
      const barHeight = dataArray[i] / 12;
      visualizerBars[i].style.height = barHeight + "px";
      boxes2[i].style.height = visualizerBars[i].style.height;
    }

    requestAnimationFrame(draw);
  }

  draw();
}

const list = document.querySelectorAll(".list");
function activeLink() {
  list.forEach((item) => item.classList.remove("active"));
  this.classList.add("active");
}

list.forEach((item) => item.addEventListener("click", activeLink));

function openChat() {
  document.getElementById("ad").style.display = "none";
  document.getElementById("user_img").src = "logo.png";
  document.getElementById("output").style.display = "block";
  document.getElementById("name_to_be_displayed").innerHTML = "GoChat";
  document.getElementById("overlay_user_id").style.display = "none";
  document.getElementById("navigation").style.bottom = "-100px";
  document.getElementById("contain").style.bottom = "0";
  document.getElementById("logoutBtn").id = "outBtn";
  document.getElementById("chatsNav").classList.add("active");
  document.getElementById("searchNav").classList.remove("active");
  document.getElementById("Nav").classList.remove("active");

  document.getElementById("icon_more").style.display = "block";
  document.getElementById("modeS").style.right = "97px";
  for (let i = 0; i > -150; i--) {
    document.getElementById("navigation").style.bottom = i + "px";
    document.getElementById("navigation").style.transition = "0.5s";
  }
}

function outcheck(clicked_id) {
  if (clicked_id === "logoutBtn") {
    document.getElementById("overlay_out").style.display = "block";
  } else if (clicked_id === "outBtn") {
    document.getElementById("ad").style.display = "block";
    // document.getElementById("user_img").src = "logo.png";
    document.getElementById("output").style.display = "none";
    document.getElementById("name_to_be_displayed").innerHTML = "GoChat";
    document.getElementById("overlay_user_id").style.display = "block";
    document.getElementById("navigation").style.bottom = "0px";
    document.getElementById("contain").style.bottom = "-100px";
    for (let i = -100; i < -150; i++) {
      document.getElementById("navigation").style.bottom = i + "px";
      document.getElementById("navigation").style.transition = "0.5s";
    }
    document.getElementById("outBtn").id = "logoutBtn";
    document.getElementById("searchNav").classList.add("active");
    document.getElementById("chatsNav").classList.remove("active");
    document.getElementById("Nav").classList.remove("active");
    document.getElementById("icon_more").style.display = "none";
    document.getElementById("down_icon").style.display="none";
    document.getElementById("modeS").style.right = "60px";
  }
}

function logout() {
  localStorage.removeItem("room_name");
  window.location = "index.html";
}

function cancelLogout() {
  document.getElementById("overlay_out").style.display = "none";
}

window.onload = userSearch;
function userSearch() {
  document.getElementById("searchNav").classList.add("active");
}

function close_popup_img(){
  document.getElementById("overlay_img").style.display = "none";
}
