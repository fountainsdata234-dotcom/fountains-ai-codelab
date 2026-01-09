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
    receipt
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
        "Access Denied: The Key is incorrect or doesn't match this email address."
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
    await auth.signInWithEmailAndPassword(mail, pass);
    window.location.href = "dashboard.html";
  } catch (e) {
    setLoading(btnId, false);
    alert("Login failed: Check your email and password.");
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

    // If NEW Google user, stop them and ask for Passkey
    const keyPrompt = prompt(
      "Google Sign-In Successful! \nTo complete registration, enter the Mandatory Access Key sent by Admin:"
    );

    if (!keyPrompt) {
      await gUser.delete(); // Rollback auth if no key provided
      return alert("Access Key is required to enter the Lab.");
    }

    // Verify Key matches Google Email in Firestore
    const keyDoc = await db.collection("passkeys").doc(gMail).get();

    if (!keyDoc.exists || keyDoc.data().key !== keyPrompt) {
      alert(
        "Security Error: This Google account is not authorized with that Key."
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
