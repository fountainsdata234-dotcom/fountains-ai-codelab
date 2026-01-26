// 1. FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC6i5OswlTLw69VNR64b7fIOaiYQXX_bSA",
  authDomain: "fountains-ai-codelab.firebaseapp.com",
  projectId: "fountains-ai-codelab",
  storageBucket: "fountains-ai-codelab.firebasestorage.app",
  measurementId: "G-WJ4JWB5GNB",
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// 2. LOAD PROFILE
auth.onAuthStateChanged((user) => {
  if (user) {
    const isGoogle = user.providerData[0].providerId === "google.com";
    document.getElementById("email-display").value = user.email;

    // Sync UI with Firestore Real-time
    db.collection("users")
      .doc(user.uid)
      .onSnapshot((doc) => {
        const data = doc.data() || {};
        const nickname = data.username || user.displayName || "Student";
        document.getElementById("username-input").value = nickname;

        // Unique Avatar Logic
        const avatarUrl =
          data.avatar ||
          user.photoURL ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
        document.getElementById("profile-img").src = avatarUrl;

        // If Google User, block photo editing (Google rules)
        if (isGoogle) {
          document.getElementById("upload-btn").style.pointerEvents = "none";
          document.getElementById("upload-btn").innerHTML =
            "<span>Managed by Google</span>";
        }

        // Update navbar elements
        document.getElementById("nav-user-name").innerText = nickname;
        document.getElementById("nav-user-img").src = avatarUrl;
        document.getElementById("mobile-user-name").innerText = nickname;
        document.getElementById("mobile-user-img").src = avatarUrl;
      });

    loadScores(user.email);
  } else {
    window.location.href = "index.html";
  }
});

// 3. AVATAR SHUFFLE LOGIC
async function shuffleAvatar() {
  const user = auth.currentUser;
  if (!user) return;

  const status = document.getElementById("upload-status");
  status.innerText = "SHUFFLING...";

  // Generate unique seed using UID + Timestamp + Random
  const seed =
    user.uid + "_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

  try {
    await db.collection("users").doc(user.uid).update({ avatar: newAvatar });
    status.innerText = "UPDATED!";
    setTimeout(() => (status.innerText = ""), 2000);
  } catch (err) {
    console.error(err);
    status.innerText = "ERROR";
    alert("Failed to update avatar");
  }
}

// 4. SAVE USERNAME
async function saveSettings() {
  const user = auth.currentUser;
  const newName = document.getElementById("username-input").value;
  if (user && newName) {
    try {
      await db.collection("users").doc(user.uid).update({ username: newName });
      alert("Profile saved successfully!");
    } catch (e) {
      alert("Error saving profile: " + e.message);
    }
  }
}

// 5. PROJECT TRACKER LOGIC
function loadScores(email) {
  db.collection("submissions")
    .where("studentEmail", "==", email)
    .onSnapshot((snap) => {
      const container = document.getElementById("project-list");
      if (snap.empty) return;
      container.innerHTML = "";
      snap.forEach((doc) => {
        const s = doc.data();
        container.innerHTML += `
                        <div class="track-item">
                            <div>
                                <strong style="display:block">${
                                  s.moduleTitle || "Project Submission"
                                }</strong>
                                <small style="opacity:0.5">${new Date(
                                  s.timestamp?.toDate(),
                                ).toLocaleDateString()}</small>
                            </div>
                            <div class="score-pill">${s.score}%</div>
                        </div>
                    `;
      });
    });
}

// Animations
gsap.from(".gsap-reveal", {
  y: 30,
  opacity: 0,
  duration: 1,
  ease: "power4.out",
});
if (localStorage.getItem("fnt-theme") === "dark")
  document.body.classList.add("dark-theme");

// Mobile Menu Logic
function setupMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  btn.onclick = () => {
    menu.classList.toggle("open");
    btn.classList.toggle("active");
  };
}

// Theme Logic
function setupTheme() {
  const toggleTheme = (btn) => {
    // Dangling Animation for desktop icon
    if (btn.classList.contains("icon-btn")) {
      btn.classList.remove("dangle-anim");
      void btn.offsetWidth;
      btn.classList.add("dangle-anim");
    }
    document.body.classList.toggle("dark-theme");
    localStorage.setItem(
      "fnt-theme",
      document.body.classList.contains("dark-theme") ? "dark" : "light",
    );
  };

  const btnDesktop = document.getElementById("themeToggle");
  const btnMobile = document.getElementById("themeToggleMobile");

  if (btnDesktop) btnDesktop.onclick = () => toggleTheme(btnDesktop);
  if (btnMobile) btnMobile.onclick = () => toggleTheme(btnMobile);

  if (localStorage.getItem("fnt-theme") === "dark")
    document.body.classList.add("dark-theme");
}

setupMobileMenu();
setupTheme();

const btn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) btn.classList.add("visible");
  else btn.classList.remove("visible");
});
btn.onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// ROBOT ANIMATION
(function () {
  const robotScene = document.getElementById("robot-scene");
  const pupilL = document.getElementById("pupil-l");
  const pupilR = document.getElementById("pupil-r");
  const mouth = document.getElementById("mouth-wave");
  if (!robotScene) return;

  // EMOTIONS
  const smilePath = "M85 185 Q120 210 155 185";
  const frownPath = "M85 200 Q120 160 155 200";
  const unsurePath = "M85 190 Q120 190 155 190";

  // Default Smile
  if (mouth) mouth.setAttribute("d", smilePath);

  // Emotion Listeners
  document.body.addEventListener("mouseover", (e) => {
    const target = e.target.closest(
      "button, a, .btn-main, .btn-sec, .read-more-btn, .icon-btn",
    );
    if (target) {
      const text = target.innerText.toLowerCase();
      if (
        text.includes("logout") ||
        text.includes("exit") ||
        target.classList.contains("logout-btn")
      ) {
        if (mouth) gsap.to(mouth, { attr: { d: frownPath }, duration: 0.3 });
      } else {
        if (mouth) gsap.to(mouth, { attr: { d: unsurePath }, duration: 0.3 });
      }
    }
  });
  document.body.addEventListener("mouseout", (e) => {
    const target = e.target.closest(
      "button, a, .btn-main, .btn-sec, .read-more-btn, .icon-btn",
    );
    if (target) {
      if (mouth) gsap.to(mouth, { attr: { d: smilePath }, duration: 0.3 });
    }
  });

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let tilt = { x: 0, y: 0, received: false }; // Flag to check for sensor data
  let current = { x: 0, y: 0 };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  const handleOrientation = (e) => {
    if (e.beta !== null && e.gamma !== null) {
      tilt.x = e.gamma; // left-right
      tilt.y = e.beta; // front-back
      tilt.received = true;
    }
  };

  // Attempt to add the event listener for device orientation
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", handleOrientation, true);
  }

  function animateRobot() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    let targetX = 0;
    let targetY = 0;

    if (tilt.received) {
      // If we have tilt data, use it exclusively
      targetX = Math.max(-2, Math.min(2, tilt.x / 15)); // Increased sensitivity
      targetY = Math.max(-2, Math.min(2, (tilt.y - 45) / 15));
    } else {
      // Otherwise, fall back to mouse
      targetX = (mouse.x - centerX) / centerX;
      targetY = (mouse.y - centerY) / centerY;
    }

    current.x += (targetX - current.x) * 0.1;
    current.y += (targetY - current.y) * 0.1;
    const pX = current.x * 10;
    const pY = current.y * 8;
    if (pupilL) pupilL.setAttribute("transform", `translate(${pX}, ${pY})`);
    if (pupilR) pupilR.setAttribute("transform", `translate(${pX}, ${pY})`);
    if (robotScene)
      robotScene.style.transform = `rotateY(${current.x * 15}deg) rotateX(${
        -current.y * 15
      }deg)`;
    requestAnimationFrame(animateRobot);
  }
  animateRobot();
})();
