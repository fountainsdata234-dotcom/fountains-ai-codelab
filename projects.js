const firebaseConfig = {
  apiKey: "AIzaSyC6i5OswlTLw69VNR64b7fIOaiYQXX_bSA",
  authDomain: "fountains-ai-codelab.firebaseapp.com",
  projectId: "fountains-ai-codelab",
  storageBucket: "fountains-ai-codelab.firebasestorage.app",
  messagingSenderId: "447605557154",
  appId: "1:447605557154:web:4475a21963961b5e1514fb",
  measurementId: "G-WJ4JWB5GNB",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// UI INIT
window.onload = () => {
  setupMobileMenu();
  setupTheme();
  setupBackToTop();
};

function setupMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  btn.onclick = () => {
    menu.classList.toggle("open");
    btn.classList.toggle("active");
  };
}

function setupTheme() {
  const toggleTheme = (btn) => {
    if (btn.classList.contains("icon-btn")) {
      btn.classList.remove("dangle-anim");
      void btn.offsetWidth;
      btn.classList.add("dangle-anim");
    }
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("fnt-theme", isDark ? "dark" : "light");

    const mobileBtn = document.getElementById("themeToggleMobile");
    if (mobileBtn) {
      mobileBtn.innerHTML = isDark
        ? "<span>Switch to Light</span> ☀️"
        : "<span>Switch to Dark</span> 🌓";
    }
  };
  const btnDesktop = document.getElementById("themeToggle");
  const btnMobile = document.getElementById("themeToggleMobile");
  if (btnDesktop) btnDesktop.onclick = () => toggleTheme(btnDesktop);
  if (btnMobile) btnMobile.onclick = () => toggleTheme(btnMobile);
  if (localStorage.getItem("fnt-theme") === "dark") {
    document.body.classList.add("dark-theme");
    if (btnMobile) btnMobile.innerHTML = "<span>Switch to Light</span> ☀️";
  }
}

function setupBackToTop() {
  const btn = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) btn.classList.add("visible");
    else btn.classList.remove("visible");
  });
  btn.onclick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

const ADMIN_MAIL = "fountainsdata234@gmail.com"; // Admin ID
let userMail = "";
let isAdmin = false;
let currentUsername = "Student";
let projectState = {}; // Stores dynamic project data (version, instructions)

auth.onAuthStateChanged((user) => {
  if (user) {
    userMail = user.email;
    isAdmin = user.email && user.email.toLowerCase() === ADMIN_MAIL;

    // Show Admin Chat Tools
    if (isAdmin) {
      document.getElementById("admin-chat-tools").classList.remove("hidden");
      document.getElementById("admin-chat-tools").innerHTML =
        `<button onclick="clearChat()" style="color:red; background:none; border:none; cursor:pointer; font-weight:bold; font-size:0.8rem;">🗑 WIPE ALL CHAT</button>`;
    }

    initProjectSystem();
    loadChat();

    // Sync Profile Data
    db.collection("users")
      .doc(user.uid)
      .onSnapshot((doc) => {
        const data = doc.data() || {};
        const avatar =
          data.avatar ||
          user.photoURL ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
        const name = data.username || user.displayName || "Student";

        // Force Admin Name
        if (isAdmin) currentUsername = "Admin";
        else currentUsername = name;

        if (document.getElementById("nav-user-img"))
          document.getElementById("nav-user-img").src = avatar;
        if (document.getElementById("nav-user-name"))
          document.getElementById("nav-user-name").innerText = currentUsername;
        if (document.getElementById("mobile-user-img"))
          document.getElementById("mobile-user-img").src = avatar;
        if (document.getElementById("mobile-user-name"))
          document.getElementById("mobile-user-name").innerText = isAdmin
            ? "Admin"
            : name;
      });
  } else {
    userMail = "Guest";
    initProjectSystem();
    loadChat();
  }
});

// 1. MANUAL TABS (PROJECTS)
const MODULES = [
  {
    id: "m1",
    title: "The Glassmorphic AI Portfolio",
    defaultDate: "Jan 05, 2026",
    defaultInstruction:
      "Create a modern 3-page site using AI. The Navbar must be frosted glass.",
  },
  {
    id: "m2",
    title: "Logic Bridges: AI Weather Engine",
    defaultDate: "Jan 08, 2026",
    defaultInstruction:
      "Use an API to fetch weather data. AI should generate logic.",
  },
  {
    id: "m3",
    title: "Neural Network Visualizer",
    defaultDate: "Jan 12, 2026",
    defaultInstruction:
      "Build a visual representation of nodes and weights using Canvas API.",
  },
  {
    id: "m4",
    title: "AI Chat Interface",
    defaultDate: "Jan 15, 2026",
    defaultInstruction:
      "Create a chat UI that connects to an LLM API endpoint.",
  },
  {
    id: "m5",
    title: "Recommendation Engine",
    defaultDate: "Jan 20, 2026",
    defaultInstruction:
      "Implement a product recommendation grid based on user tags.",
  },
];

function initProjectSystem() {
  renderModules();
  // Listen for dynamic project updates (Edits)
  db.collection("projects").onSnapshot((snap) => {
    snap.forEach((doc) => {
      projectState[doc.id] = doc.data();
    });
    renderModules();
  });
}

function renderModules() {
  const list = document.getElementById("assignments");
  list.innerHTML = MODULES.map((m) => {
    const state = projectState[m.id] || {};
    const displayDate = state.date || m.defaultDate;
    const displayInst = state.instruction || m.defaultInstruction;
    const displayTitle = state.title || m.title;

    return `
          <div class="project-card">
            <div class="card-head" onclick="document.getElementById('body-${
              m.id
            }').classList.toggle('hidden'); loadSubmissions('${m.id}')">
              <div class="title-wrap"><span class="badge-date">${displayDate}</span><h3>${displayTitle}</h3></div>
              <span>▼</span>
            </div>
            <div id="winner-${
              m.id
            }" style="border-bottom: 1px solid var(--border);"></div>
            <div id="body-${m.id}" class="card-body hidden">
              <div class="instruction-box" id="inst-box-${m.id}">
                <p>${displayInst}</p>
                ${
                  isAdmin
                    ? `<button onclick="enableEdit('${m.id}')" style="margin-top:10px; font-size:0.8rem; cursor:pointer;">✎ Edit & Reset</button>`
                    : ""
                }
              </div>
              ${
                !isAdmin
                  ? `<div class="submit-zone">
                <h4>Submission Links</h4>
                <input type="text" id="repo-${m.id}" placeholder="GitHub Link (Admin View Only)">
                <input type="text" id="live-${m.id}" placeholder="Deployment Live Link">
                <button class="btn-submit" onclick="submitProject('${m.id}')">Submit Module</button>
              </div>`
                  : ""
              }
              
              <!-- SCROLLABLE SUBMISSIONS AREA -->
              <h4 style="margin-left:20px; margin-bottom:10px;">Class Submissions</h4>
              <div id="subs-${m.id}" class="submission-scroll">
                <p style="text-align:center; opacity:0.5">Loading submissions...</p>
              </div>
            </div>
          </div>
        `;
  }).join("");

  MODULES.forEach((m) => {
    // Listen for Winner
    db.collection("module_winners")
      .doc(m.id)
      .onSnapshot((doc) => {
        const winDiv = document.getElementById(`winner-${m.id}`);
        if (doc.exists) {
          const w = doc.data();
          winDiv.innerHTML = `
                        <div class="winner-space">
                          <img src="${w.avatar}" class="winner-avatar">
                          <span class="winner-info-text">WINNER: ${w.winner} 👑</span>
                        </div>`;
        } else {
          winDiv.innerHTML = "";
        }
      });
  });
}

// ADMIN EDIT FUNCTION
function enableEdit(id) {
  const state = projectState[id] || {};
  const defaultModule = MODULES.find((m) => m.id === id);
  const currentTitle = state.title || defaultModule.title;
  const currentInst = state.instruction || defaultModule.defaultInstruction;

  const safeTitle = currentTitle.replace(/"/g, "&quot;");

  const box = document.getElementById(`inst-box-${id}`);
  box.innerHTML = `
            <label style="font-size:0.8rem; font-weight:bold; color:var(--primary);">Project Title:</label>
            <input type="text" id="edit-title-${id}" class="edit-area" value="${safeTitle}" style="margin-bottom:10px;">
            <label style="font-size:0.8rem; font-weight:bold; color:var(--primary);">Instructions:</label>
            <textarea id="edit-inst-${id}" class="edit-area" rows="4">${currentInst}</textarea>
            <button class="btn-submit" onclick="saveProjectUpdate('${id}', this)" style="background:var(--accent);">Publish New Project</button>
            <button onclick="renderModules()" style="margin-top:5px; background:none; border:none; cursor:pointer; color:red;">Cancel</button>
        `;
}

function saveProjectUpdate(id, btn) {
  const newTitle = document.getElementById(`edit-title-${id}`).value;
  const newInst = document.getElementById(`edit-inst-${id}`).value;

  if (!newTitle || !newInst) return alert("Please fill all fields");

  // Loading State
  const originalText = btn.innerText;
  btn.classList.add("btn-loading");
  btn.disabled = true;
  btn.style.opacity = "0.7";
  btn.style.cursor = "not-allowed";

  const currentState = projectState[id] || { version: 0 };
  const newVersion = (currentState.version || 0) + 1;
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  db.collection("projects")
    .doc(id)
    .set(
      {
        title: newTitle,
        instruction: newInst,
        date: today,
        version: newVersion,
      },
      { merge: true },
    )
    .then(() => {
      alert("Project Published! Submissions reset for new version.");
      // Force UI refresh immediately
      projectState[id] = {
        title: newTitle,
        instruction: newInst,
        date: today,
        version: newVersion,
      };
      renderModules();
    })
    .catch((error) => {
      console.error("Error updating project: ", error);
      alert("Failed to publish: " + error.message);
      // Reset button state on error
      btn.classList.remove("btn-loading");
      btn.innerText = originalText;
      btn.disabled = false;
      btn.style.opacity = "1";
      btn.style.cursor = "pointer";
    });
}

function submitProject(id) {
  if (userMail === "Guest") return alert("Login first!");
  const r = document.getElementById(`repo-${id}`).value;
  const l = document.getElementById(`live-${id}`).value;
  if (!r || !l) return alert("Fill links!");

  const state = projectState[id] || { version: 0 };
  const currentVersion = state.version || 0;
  const defaultTitle = MODULES.find((m) => m.id === id).title;
  const moduleTitle = state.title || defaultTitle;

  db.collection("submissions")
    .doc(userMail + "_" + id + "_v" + currentVersion)
    .set({
      studentEmail: userMail, // Changed to match profile.html query
      moduleId: id,
      moduleTitle: moduleTitle, // Added for Profile Tracker
      version: currentVersion,
      repo: r,
      live: l,
      score: 0,
      reactions: [],
      comments: [],
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => alert("Submitted!"));
}

// 2. LOAD SUBMISSIONS (SCROLLABLE TAB)
function loadSubmissions(moduleId) {
  const state = projectState[moduleId] || { version: 0 };
  const currentVersion = state.version || 0;

  db.collection("submissions")
    .where("moduleId", "==", moduleId)
    .where("version", "==", currentVersion)
    .onSnapshot((snap) => {
      const container = document.getElementById(`subs-${moduleId}`);
      if (snap.empty) {
        container.innerHTML =
          "<p style='text-align:center; opacity:0.5'>No submissions yet.</p>";
        return;
      }

      container.innerHTML = snap.docs
        .map((doc) => {
          const data = doc.data();
          const isOwner = data.studentEmail === userMail;
          const subId = doc.id;

          // Logic: Admin sees Repo, Owner sees Private Chat, Everyone sees Live Link
          return `
                <div class="sub-card">
                    <div class="sub-header">
                        <div class="student-info">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${
                              data.studentEmail
                            }" class="student-avatar">
                            <div>
                                <div style="font-weight:800; font-size:0.9rem">${
                                  data.studentEmail.split("@")[0]
                                }</div>
                                <div style="font-size:0.7rem; opacity:0.6">${new Date(
                                  data.timestamp?.toDate(),
                                ).toLocaleDateString()}</div>
                            </div>
                        </div>
                        
                        <!-- SPEEDOMETER -->
                        <div class="gauge-wrapper">
                            <svg class="gauge" viewBox="0 0 100 60" style="width:60px;">
                                <path class="gauge-bg" d="M10 50 A40 40 0 0 1 90 50" />
                                <path class="gauge-fill" d="M10 50 A40 40 0 0 1 90 50" 
                                    style="stroke-dashoffset: ${
                                      126 * (1 - (data.score || 0) / 100)
                                    }; stroke: ${
                                      data.score < 50 ? "#ef4444" : "#10b981"
                                    }" />
                            </svg>
                            <div class="gauge-val">${data.score}%</div>
                        </div>
                    </div>
                    
                    <!-- ADMIN CONTROLS (Cup & Bin) -->
                    ${
                      isAdmin
                        ? `
                    <div class="admin-controls" style="margin-bottom:10px; justify-content:flex-end;">
                        <button onclick="deleteSubmission('${subId}')" style="border:none; background:none; cursor:pointer; font-size:1.2rem;" title="Delete Submission">🗑️</button>
                    </div>
                    `
                        : ""
                    }

                    <div class="project-links">
                        <a href="${
                          data.live
                        }" target="_blank" class="link-pill link-live">
                            <span>🚀</span> Live Demo
                        </a>
                        
                        <!-- REACTION BUTTON -->
                        <button class="fire-btn ${
                          (data.reactions || []).includes(userMail)
                            ? "active"
                            : ""
                        }" 
                            onclick="toggleReaction('${subId}')">
                            🔥 ${data.reactions ? data.reactions.length : 0}
                        </button>

                        ${
                          isAdmin
                            ? `<a href="${data.repo}" target="_blank" class="link-pill link-repo"><span>📦</span> Repo (Admin)</a>`
                            : ""
                        }
                    </div>

                    <!-- ADMIN CONTROLS -->
                    ${
                      isAdmin
                        ? `
                        <div style="margin-top:10px; padding-top:10px; border-top:1px dashed var(--border)">
                            <label style="font-size:0.7rem; font-weight:800;">ADMIN GRADE:</label>
                            <input type="range" min="0" max="100" value="${data.score}" 
                                onchange="updateScore('${subId}', this.value)" style="width:100%">
                        </div>
                    `
                        : ""
                    }

                    <!-- PRIVATE COMMENTS (Visible to Admin & Owner) -->
                    ${
                      isAdmin || isOwner
                        ? `
                        <div class="private-thread">
                            <div class="pt-header">🔒 Private Feedback</div>
                            <div id="comments-${subId}">
                                ${(data.comments || [])
                                  .map(
                                    (c) => `
                                    <div class="pt-msg ${
                                      c.author === ADMIN_MAIL
                                        ? "admin"
                                        : "student"
                                    }">
                                        <strong>${
                                          c.author === ADMIN_MAIL
                                            ? "Admin"
                                            : "Me"
                                        }:</strong> ${c.text}
                                    </div>
                                `,
                                  )
                                  .join("")}
                            </div>
                            <div style="display:flex; gap:5px; margin-top:10px;">
                                <input type="text" id="input-${subId}" placeholder="Type private note..." 
                                    style="flex:1; padding:8px; border-radius:8px; border:1px solid var(--border)">
                                <button onclick="postComment('${subId}')" style="background:var(--primary); color:white; border:none; padding:0 15px; border-radius:8px;">➤</button>
                            </div>
                        </div>
                    `
                        : ""
                    }
                </div>
                `;
        })
        .join("");
    });
}

function updateScore(docId, val) {
  db.collection("submissions")
    .doc(docId)
    .update({ score: parseInt(val) });
}

function deleteSubmission(docId) {
  if (confirm("Are you sure you want to delete this submission?")) {
    db.collection("submissions").doc(docId).delete();
  }
}

function toggleReaction(docId) {
  const ref = db.collection("submissions").doc(docId);
  db.runTransaction(async (t) => {
    const doc = await t.get(ref);
    const reacts = doc.data().reactions || [];
    if (reacts.includes(userMail)) {
      t.update(ref, {
        reactions: firebase.firestore.FieldValue.arrayRemove(userMail),
      });
    } else {
      t.update(ref, {
        reactions: firebase.firestore.FieldValue.arrayUnion(userMail),
      });
    }
  });
}

function postComment(docId) {
  const txt = document.getElementById(`input-${docId}`).value;
  if (!txt) return;
  const comment = { author: userMail, text: txt, timestamp: Date.now() };
  db.collection("submissions")
    .doc(docId)
    .update({
      comments: firebase.firestore.FieldValue.arrayUnion(comment),
    });
}

// 3. COMMUNITY CHAT & VOICE VISUALIZER
function sendMsg() {
  const text = document.getElementById("chat-input").value;
  if (!text) return;

  if (!auth.currentUser) {
    alert("Please login to send messages.");
    return;
  }

  return db
    .collection("chat")
    .add({
      author: userMail,
      uid: auth.currentUser.uid,
      username: currentUsername,
      content: text,
      type: "text",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      reactions: {}, // Map for multiple emojis
      deleted: false,
    })
    .then(() => {
      document.getElementById("chat-input").value = "";
    })
    .catch((err) => alert("Error sending message: " + err.message));
}

function filterChat() {
  const term = document.getElementById("chat-search").value.toLowerCase();
  const bubbles = document.querySelectorAll(".msg-bubble");
  bubbles.forEach((b) => {
    b.style.display = b.innerText.toLowerCase().includes(term)
      ? "block"
      : "none";
  });
}

function loadChat() {
  db.collection("chat")
    .orderBy("timestamp", "asc")
    .onSnapshot((snap) => {
      const flow = document.getElementById("chat-flow");
      flow.innerHTML = "";
      snap.forEach((doc) => {
        const m = doc.data();
        const isMe = m.author === userMail;
        const date = m.timestamp
          ? new Date(m.timestamp.toDate()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "...";
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${
          m.author || "guest"
        }`;
        const displayName = m.username || m.author.split("@")[0];

        // DELETED MESSAGE LOGIC
        if (m.deleted) {
          const delText =
            m.deletedBy === ADMIN_MAIL
              ? "🚫 Message deleted by Admin"
              : `🚫 Message deleted by ${m.username || "User"}`;
          flow.innerHTML += `<div class="msg-bubble"><span class="deleted-notice" style="font-style:italic; opacity:0.6;">${delText}</span></div>`;
          return;
        }

        // Reactions Logic
        const emojis = ["👍", "❤️", "🔥", "😂"];
        let reactionHTML = `<div class="reaction-row">`;
        emojis.forEach((e) => {
          const voters = m.reactions && m.reactions[e] ? m.reactions[e] : [];
          const count = voters.length;
          const hasVoted = voters.includes(userMail);
          reactionHTML += `
                    <button class="react-btn ${
                      hasVoted ? "voted" : ""
                    }" onclick="react('${doc.id}', '${e}')">
                        ${e} <span>${count > 0 ? count : ""}</span>
                    </button>`;
        });
        reactionHTML += `</div>`;

        flow.innerHTML += `
              <div class="msg-bubble ${isMe ? "me" : "them"}">
                <div class="msg-meta">
                    ${!isMe ? `<img src="${avatar}" class="msg-avatar">` : ""}
                    <span>${displayName}</span>
                    <span style="font-weight:400; font-size:0.65rem; margin-left:auto;">${date}</span>
                    ${
                      isAdmin || isMe
                        ? `<span class="del-msg" onclick="deleteMsg('${doc.id}', '${m.author}')">[DEL]</span>`
                        : ""
                    }
                </div>
                <p>${m.content}</p>
                ${reactionHTML}
              </div>`;
      });
      flow.scrollTop = flow.scrollHeight;
    });
}

function react(id, emoji) {
  const ref = db.collection("chat").doc(id);
  db.runTransaction(async (t) => {
    const doc = await t.get(ref);
    const data = doc.data();
    let reactions = data.reactions || {};

    // Initialize array if not exists
    if (!reactions[emoji]) reactions[emoji] = [];

    const voters = reactions[emoji];
    if (voters.includes(userMail)) {
      // Remove vote
      reactions[emoji] = voters.filter((e) => e !== userMail);
    } else {
      // Add vote
      reactions[emoji].push(userMail);
    }

    t.update(ref, { reactions: reactions });
  });
}

function deleteMsg(id, author) {
  if (!isAdmin && userMail !== author) {
    alert("You can only delete your own messages.");
    return;
  }
  if (confirm("Delete this message?")) {
    db.collection("chat").doc(id).update({
      deleted: true,
      deletedBy: userMail,
    });
  }
}

// CLEAR CHAT (DUSTBIN)
async function clearChat() {
  if (
    !confirm(
      "⚠️ DANGER: This will delete ALL chat messages permanently. Are you sure?",
    )
  )
    return;

  const snap = await db.collection("chat").get();
  const batch = db.batch();
  snap.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  alert("Chat cleared successfully.");
}

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
