// --- 1. FIREBASE CONFIGURATION ---
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
const auth = firebase.auth();
const db = firebase.firestore();

// --- 2. UI UTILITIES (Loading & Password Toggle) ---

// Toggle Loading Spinner on Buttons
function setLoading(buttonId, isLoading) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  if (isLoading) {
    btn.classList.add("btn-loading");
    btn.disabled = true;
  } else {
    btn.classList.remove("btn-loading");
    btn.disabled = false;
  }
}

// Toggle Password Visibility with Eye Icon Swap
function togglePass(inputId, iconId) {
  const passInput = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (passInput.type === "password") {
    passInput.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    passInput.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

// Switch between Login, Register, and Request forms
function toggleForm(type) {
  const sections = ["login-section", "register-section", "request-section"];
  const card = document.getElementById("form-box");

  card.style.opacity = "0";
  card.style.transform = "translateY(10px)";

  setTimeout(() => {
    sections.forEach((s) => document.getElementById(s).classList.add("hidden"));
    document.getElementById(`${type}-section`).classList.remove("hidden");
    card.style.opacity = "1";
    card.style.transform = "translateY(0)";
  }, 300);
}

// --- 3. WHATSAPP RECEIPT LOGIC ---
function sendToWhatsapp() {
  const email = document.getElementById("request-email").value.trim();
  const btnId = "wa-btn";

  if (!email.includes("@")) {
    alert("Please enter a valid email address.");
    return;
  }

  setLoading(btnId, true);

  const receipt = `
*FOUNTAINS AI CODELAB*
---------------------------
*MEMBER ACCESS RECEIPT*
Email: ${email}
Status: PENDING KEY
Date: ${new Date().toLocaleDateString()}
---------------------------
Hi Admin, I've requested access to the CodeLab. Please send my unique passkey to this email.`;

  const waUrl = `https://wa.me/2348029772375?text=${encodeURIComponent(
    receipt,
  )}`;

  setTimeout(() => {
    window.open(waUrl, "_blank");
    setLoading(btnId, false);
  }, 800);
}

// --- 4. REGISTRATION LOGIC (With Mandatory Passkey) ---
async function handleRegistration() {
  const user = document.getElementById("reg-username").value.trim();
  const mail = document.getElementById("reg-email").value.trim().toLowerCase();
  const pass = document.getElementById("reg-password").value;
  const keyInput = document.getElementById("reg-key").value.trim();
  const btnId = "reg-btn";

  if (!user || !mail || !pass || !keyInput) {
    alert("All fields including the Access Key are mandatory!");
    return;
  }

  setLoading(btnId, true);

  try {
    // Step A: Verify Passkey in Firestore (Doc ID must be the email)
    const keyDoc = await db.collection("passkeys").doc(mail).get();

    if (!keyDoc.exists || keyDoc.data().key !== keyInput) {
      setLoading(btnId, false);
      return alert(
        "Access Denied: The Key is incorrect or doesn't match this email address.",
      );
    }

    // Step B: Create Firebase Auth Account
    const cred = await auth.createUserWithEmailAndPassword(mail, pass);

    // Step C: Generate Unique Permanent Avatar
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${cred.user.uid}`;

    // Step D: Save Student Profile to Firestore
    await db.collection("users").doc(cred.user.uid).set({
      username: user,
      email: mail,
      avatar: avatar,
      role: "student",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    window.location.href = "dashboard.html";
  } catch (e) {
    setLoading(btnId, false);
    alert("Registration Error: " + e.message);
  }
}

// --- 5. LOGIN LOGIC ---
async function handleLogin() {
  const mail = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-password").value;
  const btnId = "login-btn";

  if (!mail || !pass) return alert("Please fill in your login details.");

  setLoading(btnId, true);

  try {
    const userCredential = await auth.signInWithEmailAndPassword(mail, pass);

    // --- ADMIN BYPASS FOR EMAIL LOGIN ---
    if (
      userCredential.user.email.toLowerCase() === "fountainsdata234@gmail.com"
    ) {
      await db
        .collection("users")
        .doc(userCredential.user.uid)
        .set(
          {
            username: "Admin",
            email: userCredential.user.email.toLowerCase(),
            avatar:
              userCredential.user.photoURL ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${userCredential.user.uid}`,
            role: "admin",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
    }

    window.location.href = "dashboard.html";
  } catch (e) {
    setLoading(btnId, false);
    let errorMessage = "Login failed. Please check your credentials.";
    if (
      e.code === "auth/user-not-found" ||
      e.code === "auth/wrong-password" ||
      e.code === "auth/invalid-credential"
    ) {
      errorMessage = "Invalid email or password. Please try again.";
    } else if (e.code === "auth/too-many-requests") {
      errorMessage =
        "Access to this account has been temporarily disabled due to many failed login attempts. You can restore it by resetting your password or you can try again later.";
    }
    alert(errorMessage);
  }
}

// --- PASSWORD RESET LOGIC ---
async function resetPassword() {
  const mail = document.getElementById("login-email").value.trim();
  if (!mail) {
    alert("Please enter your email address in the login field first.");
    return;
  }
  try {
    await auth.sendPasswordResetEmail(mail);
    alert("Password reset link sent to " + mail + ". Check your inbox!");
  } catch (e) {
    alert("Error: " + e.message);
  }
}

// --- 6. GOOGLE FLOW + MANDATORY PASSKEY ---
async function handleGoogleFlow() {
  const provider = new firebase.auth.GoogleAuthProvider();

  try {
    const result = await auth.signInWithPopup(provider);
    const gUser = result.user;
    const gMail = gUser.email.toLowerCase();

    // Check if user already exists in our database
    const userDoc = await db.collection("users").doc(gUser.uid).get();
    if (userDoc.exists) {
      window.location.href = "dashboard.html";
      return;
    }

    // --- ADMIN BYPASS (Fix for Lockout) ---
    if (gMail === "fountainsdata234@gmail.com") {
      await db.collection("users").doc(gUser.uid).set({
        username: "Admin",
        email: gMail,
        avatar: gUser.photoURL,
        role: "admin",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      window.location.href = "dashboard.html";
      return;
    }

    // If NEW Google user, stop them and ask for Passkey
    const keyPrompt = prompt(
      "Google Sign-In Successful! \nTo complete registration, enter the Mandatory Access Key sent by Admin:",
    );

    if (!keyPrompt) {
      await gUser.delete(); // Rollback auth if no key provided
      return alert("Access Key is required to enter the Lab.");
    }

    // Verify Key matches Google Email in Firestore
    const keyDoc = await db.collection("passkeys").doc(gMail).get();

    if (!keyDoc.exists || keyDoc.data().key !== keyPrompt) {
      alert(
        "Security Error: This Google account is not authorized with that Key.",
      );
      await gUser.delete();
      return;
    }

    // Success: Save Profile using Google DP and Name
    await db.collection("users").doc(gUser.uid).set({
      username: gUser.displayName,
      email: gMail,
      avatar: gUser.photoURL,
      role: "student",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Google Error: " + error.message);
  }
}

// --- 7. SPIDER WEB LIVE BACKGROUND ---
const canvas = document.getElementById("spider-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];

  // Resize handling
  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  };

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5; // Slow movement
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Bounce off edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = (width * height) / 15000; // Density
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  // Mouse Interaction
  let mouse = { x: null, y: null };
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
      p.update();
      p.draw();

      // Connect to Mouse
      const dxMouse = mouse.x - p.x;
      const dyMouse = mouse.y - p.y;
      const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

      if (distMouse < 150) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distMouse / 150})`;
        ctx.lineWidth = 1;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();

        // Slight attraction to mouse
        p.x += dxMouse * 0.01;
        p.y += dyMouse * 0.01;
      }

      // Connect to other particles
      for (let j = index + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  resize();
  animate();
}

// --- 8. ROBOT ANIMATION ---
(function () {
  const robotScene = document.getElementById("robot-scene");
  const pupilL = document.getElementById("pupil-l");
  const pupilR = document.getElementById("pupil-r");
  const mouth = document.getElementById("mouth-wave");
  if (!robotScene) return;

  // ADD BLUSH
  const robotSvg = document.getElementById("robot-svg");
  if (robotSvg && !document.getElementById("blush-l")) {
    const createBlush = (id, cx) => {
      const c = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      c.id = id;
      c.setAttribute("cx", cx);
      c.setAttribute("cy", "155");
      c.setAttribute("r", "8");
      c.setAttribute("fill", "#fbcfe8"); // Baby Pink
      c.setAttribute("opacity", "0.4");
      c.style.pointerEvents = "none";
      return c;
    };
    const face =
      robotSvg.querySelector("rect[fill='#1e293b']") ||
      robotSvg.querySelector("rect");
    if (face && face.parentNode) {
      face.parentNode.insertBefore(
        createBlush("blush-l", "75"),
        face.nextSibling,
      );
      face.parentNode.insertBefore(
        createBlush("blush-r", "165"),
        face.nextSibling,
      );
    }
  }

  // EMOTIONS
  const smilePath = "M85 185 Q120 210 155 185";
  const frownPath = "M85 200 Q120 160 155 200";
  const unsurePath = "M85 190 Q120 190 155 190";

  // Default Smile
  if (mouth) {
    const animate = mouth.querySelector("animate");
    if (animate) animate.remove(); // Remove conflicting SMIL animation
    mouth.setAttribute("d", smilePath);
  }

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
  let tilt = { x: 0, y: 0 };
  let current = { x: 0, y: 0 };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("deviceorientation", (e) => {
    tilt.x = e.gamma || 0;
    tilt.y = e.beta || 0;
  });

  function animateRobot() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const targetX = (mouse.x - centerX) / centerX + tilt.x / 45;
    const targetY = (mouse.y - centerY) / centerY + (tilt.y / 45 - 1);
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
