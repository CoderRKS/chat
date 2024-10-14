// variables for frequently used elements---->
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
var spanElement = document.getElementById("span_hello");
var room_name = localStorage.getItem("room_name");
var ImgName, ImgUrl;
var files = [];
var reader = new FileReader();
var savedUsername = getSavedUsername();
var sendSound = document.getElementById("sendsound");
var getSound = document.getElementById("getsound");
var finalTime;
getSound.volume = 0.3;
sendSound.volume = 0.3;

//firebase initailise--->
const firebaseConfig = {
  apiKey: "AIzaSyBw0PH0pbur1pFP_-fTXmv2YN-19m5TD_c",
  authDomain: "chat-98657.firebaseapp.com",
  databaseURL: "https://chat-98657-default-rtdb.firebaseio.com",
  projectId: "chat-98657",
  storageBucket: "chat-98657.appspot.com",
  messagingSenderId: "201602061907",
  appId: "1:201602061907:web:c9c3c61d035f44391998a6"
};

const firebaseConfig_cr = {
  apiKey: "AIzaSyB8tyFqR_jAdVc_y7dUSrPeJKlnRAM5Tg0",
  authDomain: "msgs-ef27b.firebaseapp.com",
  databaseURL: "https://msgs-ef27b-default-rtdb.firebaseio.com",
  projectId: "msgs-ef27b",
  storageBucket: "msgs-ef27b.appspot.com",
  messagingSenderId: "1021944904300",
  appId: "1:1021944904300:web:211b95080eff77ab767649"
};

const firebaseApp_main = firebase.initializeApp(firebaseConfig);
const firebaseApp_other = firebase.initializeApp(firebaseConfig_cr, "other");

//get cookies=>
function getCookie(name) {
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let cookie of cookieArray) {
    cookie = cookie.trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
}

// Check if the user is logged in---------->
window.onload = checkLogin;
function checkLogin() {
  const savedUsername = getCookie("username");
  if (savedUsername === "") {
    window.location.href = "index.html";
  } else {
    console.log("User is logged in as:", savedUsername);
    document.getElementById("my_pro_text").innerHTML = savedUsername;
    document.getElementById("test_user_pro").innerText = savedUsername;
  }
}

// get the Saved Username and load the light/dark mode--------->
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

// Function to set a cookie
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // days to milliseconds
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/"; // Set cookie with the given parameters
}

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
document.getElementById("my_pro_text").innerHTML = savedUsername;
document.getElementById("test_user_pro").innerText = savedUsername;

// Mode Switch Toggler------->
modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    console.log("dsfsdfdsf");
    modeText.innerText = "Light mode";
    setCookie("darkMode", "true", 30);
  } else {
    console.log("dsfsdfdsf");
    modeText.innerText = "Dark mode";
    setCookie("darkMode", "false", 30);
  }
});

// Clock---------->
setInterval(() => {
  var dt = new Date();
  var hours = dt.getHours() % 12 || 12;
  var AmOrPm = dt.getHours() >= 12 ? "PM" : "AM";
  var minutes = dt.getMinutes().toString().padStart(2, "0");
  finalTime = hours + ":" + minutes + " " + AmOrPm;
  document.getElementById("timetext").innerHTML = finalTime;
}, 1000);

// user pic load------------->
function show_user_pro_pic() {
  var pro_pic_user = room_name.replace(savedUsername, "");
  firebaseApp_main
    .database()
    .ref(pro_pic_user)
    .once("value")
    .then(function (snapshot) {
      var user_pic = snapshot.val().imageDataUrl;
      document.getElementById("pro_pic_display").src = user_pic;
    })
    .catch(function (error) {
      console.error("Error fetching user image data:", error);
    });
}

// function to get user's data=>
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
          const userHTML =
            "<div class='user_flex'><img src='" +
            userimg +
            "' class='img_pro_pic_users'>" +
            "<p class='user_name_id' onclick='createChat(this.innerText)'>" +
            userID;
          userOutput.innerHTML += userHTML;
        }
      });
    })
    .catch(function (error) {
      console.error("Error retrieving user data:", error);
    });
}
getUsers();

// search users=>
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

// after selecting user, create and navigat to chat room=>
function createChat(userID) {
  var sender = savedUsername;
  var receiver = userID;
  var room_name1 = sender + receiver;
  var room_name2 = receiver + sender;
  firebaseApp_other
    .database()
    .ref("/")
    .once("value")
    .then(function (snapshot) {
      if (snapshot.hasChild(room_name1)) {
        navigateToChat(room_name1);
        document.getElementById("ad").style.display = "none";
        document.getElementById("output").style.display = "block";
        document.getElementById("output").style.height = "calc(100% - 160px)";
        document.getElementById("output").style.borderRadius =
          "3px 3px 15px 15px";
        document.getElementById("top_details").style.display = "block";
      } else if (snapshot.hasChild(room_name2)) {
        navigateToChat(room_name2);
        document.getElementById("ad").style.display = "none";
        document.getElementById("output").style.display = "block";
        document.getElementById("output").style.height = "calc(100% - 160px)";
        document.getElementById("output").style.borderRadius =
          "3px 3px 15px 15px";
        document.getElementById("top_details").style.display = "block";
      } else {
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
            document.getElementById("ad").style.display = "none";
            document.getElementById("output").style.display = "block";
          });
      }
    })
    .then(() => {
      profile_sec.style.display = "none";
      roomHome.style.display = "block";

      if (window.innerWidth < "1050") {
        document.getElementById("home").style.left = "80px";
        document.getElementById("home").style.width = "calc(100% - 80px)";
        document.querySelector(".sidebar").classList.add("close");
        document.getElementById("time_bottom").style.display = "none";
        document.getElementById("openNavBtn").style.display = "block";
      } else {
        document.querySelector(".sidebar").classList.remove("close");
        document.getElementById("time_bottom").style.display = "flex";
      }
      show_user_pro_pic();
    })
    .catch(function (error) {
      console.error("Error checking if chat room exists:", error);
    });
}

function navigateToChat(roomName) {
  localStorage.setItem("room_name", roomName);
  getData();
}

// load the pic of user to be with chat=>
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
user_img();

// send function=>
function send() {
  msg = document.getElementById("msg").value.trim();
  var room_name = localStorage.getItem("room_name");
  if (msg.length > 0 && msg != "") {
    firebaseApp_other.database().ref(room_name).push({
      name: savedUsername,
      message: msg,
      time: finalTime,
    });
    getSound.play();
    document.getElementById("msg").value = "";
  } else {
    window.alert("Message cannot be empty");
  }
  previousSender = name;
}

// Main chat function for user load, chat load etc.- -------------------->
function getData() {
  showall();
  room_name = localStorage.getItem("room_name");
  document.getElementById("ad").style.display = "none";
  document.getElementById("output").style.display = "block";
  document.getElementById("output").style.height = "calc(100% - 160px)";
  document.getElementById("output").style.borderRadius = "3px 3px 15px 15px";
  document.getElementById("top_details").style.display = "block";
  var name_of_user = room_name.replace(savedUsername, "");
  document.getElementById("user_name_sender-reciver").innerHTML = name_of_user;
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

// Text Send------------------------------------------------------------------------------------------->
function send() {
  msg = document.getElementById("msg").value.trim();
  var room_name = localStorage.getItem("room_name");
  if (msg.length > 0 && msg != "") {
    firebaseApp_other.database().ref(room_name).push({
      name: savedUsername,
      message: msg,
      time: finalTime,
    });
    getSound.play();
    document.getElementById("msg").value = "";
  } else {
    window.alert("Message cannot be empty");
  }
  previousSender = name;
}

// Image Send------------------------------------------------------------------------------------------->
// image select on icon click =>
function clickattach() {
  var input = document.getElementById("files");
  input.type = "file";
  input.onchange = (e) => {
    document.getElementById("overlay").style.display = "block";
    files = e.target.files;
    reader = new FileReader();
    reader.onload = function () {
      document.getElementById("myimg").src = reader.result;
    };
    reader.readAsDataURL(files[0]);
  };
  input.click();
}

// upload image in web =>
function uploadImage() {
  var fileInput = document.getElementById("files");

  if (fileInput.files.length > 0) {
    var file = fileInput.files[0];
    var fileName = file.name.split(".").slice(0, -1).join(".");
    if (file) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var imageDataUrl = event.target.result;
        saveImageToDatabase(imageDataUrl, fileName);
      };
      reader.readAsDataURL(file);
      getSound.play();
    } else {
      window.alert("No file selected.");
    }
  } else {
    window.alert("No file selected.");
  }
  document.getElementById("overlay").style.display = "none";
  retrieveImage();
}

// from web upload image in Firebase =>
function saveImageToDatabase(imageDataUrl, fileName) {
  firebaseApp_other
    .database()
    .ref(room_name + "images")
    .push({
      imageDataUrl: imageDataUrl,
      nameimage: fileName,
      time: finalTime,
    })
    .catch((error) => {
      window.alert("Error sending the image");
    });
}

// retrive image from Firebase to chats=>
function retrieveImage() {
  var imagesRef = firebaseApp_other
    .database()
    .ref(room_name + "images")
    .orderByKey()
    .limitToLast(1);
  imagesRef
    .once("value")
    .then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var imageDataUrl = childSnapshot.val().imageDataUrl;
        if (imageDataUrl) {
          firebaseApp_other
            .database()
            .ref(room_name)
            .push({
              name: savedUsername,
              message: imageDataUrl,
              time: finalTime,
              type: "image",
            })
            .catch((error) => {
              window.alert("Error getting the image");
            });
        }
      });
    })
    .catch(function (error) {
      console.error("Error retrieving image:", error);
    });
}

// Voice Send------------------------------------------------------------------------------------------->
let mediaRecorder;
let recordedChunks = [];
const audioElement = document.querySelector("audio");
const visualizerBars = document.querySelectorAll(".bar");
const recordButton = document.getElementById("rec_btn");
const stopButton = document.getElementById("pause_rec_btn");
var stream;
var timerInterval;

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

// all functions of Sound are in one container because it all happens in one.=>
async function startRecording() {
  document.getElementById("btn_microphone").style.display = "none";
  document.getElementById("record").style.display = "flex";
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (event) => {
    recordedChunks.push(event.data);
  };

  mediaRecorder.start();
  visualizeAudio(stream);

  // function after recoding.=>
  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(recordedChunks, { type: "audio/wav" });
    mediaRecorder = null;
    recordedChunks = [];
    const storageRef = firebaseApp_other
      .storage()
      .ref()
      .child("audio/" + new Date().toISOString() + ".wav");
    const uploadTask = storageRef.put(audioBlob);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading audio:", error);
          reject(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            resolve(downloadURL);
            uploadAudio(downloadURL);
          });
        }
      );
    });
  };

  // upload the recorded audio in the firebase with audio link.=>
  function uploadAudio(downloadURL) {
    firebaseApp_other
      .database()
      .ref(room_name + "Audio")
      .push({
        audioUrl: downloadURL,
      });
    retriveAudio();
  }

  let minutes = 0;
  let seconds = 0;
  function updateTimer() {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    document.getElementById("time_rec").textContent = formattedTime;
  }
  timerInterval = setInterval(updateTimer, 1000);
}

function stopRecording() {
  mediaRecorder.stop();
  recordButton.disabled = false;
  stopButton.disabled = true;
  clearInterval(timerInterval);
  document.getElementById("record").style.display = "none";
  document.getElementById("btn_microphone").style.display = "flex";
  document.getElementById("btn_microphone").style.alignItems = "center";
  document.getElementById("btn_microphone").style.justifyContent = "center";
}

// get recorded Audio onto the output page.=>
function retriveAudio() {
  var imagesRef = firebaseApp_other
    .database()
    .ref(room_name + "Audio")
    .orderByKey()
    .limitToLast(1);
  imagesRef
    .once("value")
    .then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var audioUrl_toUse = childSnapshot.val().audioUrl;
        if (audioUrl_toUse) {
          firebaseApp_other
            .database()
            .ref(room_name)
            .push({
              name: savedUsername,
              message: audioUrl_toUse,
              time: finalTime,
              type: "Audio",
            })
            .then(() => {})
            .catch((error) => {
              window.alert("Error sending image URL to chat:");
            });
        } else {
          window.alert("Latest image URL is undefined.");
        }
      });
    })
    .catch(function (error) {
      console.error("Error retrieving image:", error);
    });
}

// visualizing Audio in bars.=>
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

//scroll to bottom on new msg=>
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

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// open diffrent sections=>
function homeOpen() {
  profile_sec.style.display = "none";
  roomHome.style.display = "block";
  if (window.innerWidth > "1050") {
    document.querySelector(".sidebar").classList.remove("close");
    document.getElementById("time_bottom").style.display = "flex";
  }
}

// responsiveness----------------------------------------------------------------------------------------------------------------
if (window.innerWidth < "1050") {
  document.getElementById("home").style.left = "80px";
  document.getElementById("home").style.width = "calc(100% - 80px)";
  document.querySelector(".sidebar").classList.add("close");
  document.getElementById("time_bottom").style.display = "none";
  document.getElementById("openNavBtn").style.display = "block";
} else {
  document.getElementById("openNavBtn").style.display = "none";
}

function openNavbarRes(clicked_id) {
  if (clicked_id == "openNavBtn") {
    document.getElementById("home").style.left = "265px";
    document.getElementById("home").style.width = "calc(100% - 265px)";
    document.querySelector(".sidebar").classList.remove("close");
    document.getElementById("time_bottom").style.display = "flex";
    document.getElementById("openNavBtn").style.left = "210px";
    document.getElementById("openNavBtn").style.top = "25px";
    document.getElementById("openNavBtn").style.transition = "1s";
    document.getElementById("right_arow").style.transform = "rotate(180deg)";
    document.getElementById("openNavBtn").id = "closeNavBtn";
  } else if (clicked_id == "closeNavBtn") {
    document.getElementById("home").style.left = "80px";
    document.getElementById("home").style.width = "calc(100% - 80px)";
    document.querySelector(".sidebar").classList.add("close");
    document.getElementById("time_bottom").style.display = "none";
    document.getElementById("closeNavBtn").style.left = "30px";
    document.getElementById("closeNavBtn").style.top = "80px";
    document.getElementById("closeNavBtn").style.transition = "1s";
    document.getElementById("right_arow").style.transform = "rotate(0deg)";
    document.getElementById("closeNavBtn").id = "openNavBtn";
  }
}

//KeyBoard Keys and Simple show Codes-------------------------------------------------------------------------------------------
document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    send();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.keyCode === 27 || event.which === 27) {
    cancelImage();
    document.getElementById("overlay_img").style.display = "none";
  }
});

document.getElementById("overlay_more").addEventListener("click", () => {
  document.getElementById("overlay_more").style.display = "none";
});

document.getElementById("overlay_user_id").addEventListener("click", () => {
  document.getElementById("overlay_user_id").style.display = "none";
});

document.getElementById("overlay_out").addEventListener("click", () => {
  document.getElementById("overlay_out").style.display = "none";
});

function logout() {
  localStorage.removeItem("room_name");
  window.location = "index.html";
}

function cancelImage() {
  document.getElementById("overlay").style.display = "none";
}

function pop_img(imageUrl) {
  document.getElementById("myimg_image").src = imageUrl;
  document.getElementById("overlay_img").style.display = "block";
}

function hide_popup() {
  document.getElementById("overlay_user_id").style.display = "none";
}

function logout_go() {
  document.getElementById("overlay_out").style.display = "block";
}

function show_more() {
  document.getElementById("overlay_more").style.display = "block";
}

function deleteChat() {
  document.getElementById("overlay_del").style.display = "block";
  document.getElementById("overlay_more").style.display = "none";
  var del_text = room_name.replace(savedUsername, "");
  var text_to_be_displayed = "Clear Chat with '" + del_text + "' ?";
  document.getElementById("del_text").innerHTML = text_to_be_displayed;
}

function delChat() {
  let chatRef = firebaseApp_other.database().ref(room_name);
  chatRef.remove();
  document.getElementById("overlay_del").style.display = "none";
}

function profile_show() {
  profile_sec.style.display = "flex";
  roomHome.style.display = "none";
  body.style.display = "flex";
  document.querySelector(".sidebar").classList.add("close");
  document.getElementById("time_bottom").style.display = "none";
}

function hideall() {
  document.getElementById("user_search").style.display = "flex";
  document.getElementById("overlay_user_id").style.display = "block";
  document.getElementById("user_output").style.display = "block";
}

function showall() {
  document.getElementById("overlay_user_id").style.display = "none";
  document.getElementById("user_search").style.display = "none";
  document.getElementById("user_output").style.display = "none";
}

function cancelDelChat() {
  document.getElementById("overlay_del").style.display = "none";
}

function cancelLogout(){
  document.getElementById("overlay_out").style.display="none"
}
// Profile page card animation on mouse move---------------------------------------------------------------------------------------------
const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  const mouseMoveHandler = (evt) => {
    evt.preventDefault();

    requestAnimationFrame(() => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const distanceX = evt.clientX - centerX;
      const distanceY = evt.clientY - centerY;
      const xRotation = -30 * (distanceY / centerY);
      const yRotation = 20 * (distanceX / centerX);
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
});
