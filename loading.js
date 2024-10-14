gsap.config({ trialWarn: false });
let select = (s) => document.querySelector(s),
  toArray = (s) => gsap.utils.toArray(s),
  mainSVG = select("#mainSVG"),
  allEll = toArray(".ell"),
  colorArr = ["#359EEE", "#FFC43D", "#EF476F", "#03CEA4"];

let colorInterp = gsap.utils.interpolate(colorArr);

// Initially hide the SVG
gsap.set(mainSVG, {
  visibility: "hidden",
});

// Function to animate the ellipses
function animate(el, count) {
  let tl = gsap.timeline({
    defaults: {
      ease: "sine.inOut",
    },
    repeat: 0, // Run only once
  });

  gsap.set(el, {
    opacity: 1 - count / allEll.length,
    stroke: colorInterp(count / allEll.length),
  });

  tl.to(el, {
    attr: {
      ry: `-=${count * 2.3}`,
      rx: `+=${count * 1.4}`,
    },
    ease: "sine.in",
  })
    .to(el, {
      attr: {
        ry: `+=${count * 2.3}`,
        rx: `-=${count * 1.4}`,
      },
      ease: "sine",
    })
    .to(
      el,
      {
        duration: 1,
        rotation: -180,
        transformOrigin: "50% 50%",
      },
      0
    )
    .timeScale(0.5);
}

// Function to start the animations
function startAnimation() {
  gsap.set(mainSVG, {
    visibility: "visible", // Show the SVG when starting the animation
  });

  allEll.forEach((c, i) => {
    gsap.delayedCall(i / (allEll.length - 1), animate, [c, i + 1]);
  });

  // Animate #aiGrad
  gsap.to("#aiGrad", {
    duration: 4,
    delay: 0.75,
    attr: {
      x1: "-=300",
      x2: "-=300",
    },
    scale: 1.2,
    transformOrigin: "50% 50%",
    repeat: 0, // Run only once
    ease: "none",
  });

  // Animate #ai
  gsap.to("#ai", {
    duration: 1,
    scale: 1.1,
    transformOrigin: "50% 50%",
    repeat: 0, // Run only once
    yoyo: true,
    ease: "sine.inOut",
  });
  setTimeout(changewin, 4000);
}

function changewin() {
  if (screen.width <= 700) {
    window.location = "mobile.html"
  } else {
    window.location = "Main_index.html"
  }
}

window.onload = function () {
  getSavedUsername();
  setTimeout(changeText, 2500);
};

function getSavedUsername() {
  var username = "";
  var cookies = document.cookie.split(";");
  cookies.forEach((cookie) => {
    var parts = cookie.split("=");
    if (parts[0].trim() === "username") {
      username = parts[1];
    }
  });
  document.getElementById("title").innerHTML =
    "Welcome " +
    username +
    " ...<div class='aurora'> <div class='aurora__item'></div>  <div class='aurora__item'></div>  <div class='aurora__item'></div>  <div class='aurora__item'></div></div>";
}

function changeText() {
  const fadeText = document.getElementById("title");
  fadeText.style.opacity = 0;
  setTimeout(() => {
    fadeText.style.display = "none";
    document.getElementById("mainSVG").style.display = "block";
    document.getElementById("mainSVG").style.opacity = 1;
    startAnimation();
  }, 1000); // Time for the fade out (1 second)
}
