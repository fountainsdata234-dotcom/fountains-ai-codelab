// FIREBASE INIT (Fountains AI CodeLab Config)
const firebaseConfig = {
  apiKey: "AIzaSyC6i5OswlTLw69VNR64b7fIOaiYQXX_bSA",
  authDomain: "fountains-ai-codelab.firebaseapp.com",
  projectId: "fountains-ai-codelab",
  storageBucket: "fountains-ai-codelab.firebasestorage.app",
  messagingSenderId: "447605557154",
  appId: "1:447605557154:web:4475a21963961b5e1514fb",
  measurementId: "G-WJ4JWB5GNB",
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Auth Tracking for Dashboard Header
auth.onAuthStateChanged((user) => {
  if (user) {
    // 1. Try LocalStorage for instant load (Fix loading from local storage)
    const cached = localStorage.getItem("fnt_user_" + user.uid);
    if (cached) {
      updateUI(JSON.parse(cached));
    }

    db.collection("users")
      .doc(user.uid)
      .onSnapshot((doc) => {
        const data = doc.data() || {};
        // Update Cache
        localStorage.setItem("fnt_user_" + user.uid, JSON.stringify(data));
        updateUI(data, user);
      });
  } else {
    window.location.href = "index.html"; // Kick out if not logged in
  }
});

function updateUI(data, user = auth.currentUser) {
  let name = data.username || (user && user.displayName) || "Student";

  // Force Admin Identity
  if (
    user &&
    user.email &&
    user.email.toLowerCase() === "fountainsdata234@gmail.com"
  ) {
    name = "Admin";
  }

  const avatar =
    data.avatar ||
    (user && user.photoURL) ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${
      user ? user.uid : "guest"
    }`;

  // Update Desktop Nav
  document.getElementById("nav-user-name").innerText = name;
  const navImg = document.getElementById("nav-user-img");
  if (navImg.src !== avatar) navImg.src = avatar;

  // Update Mobile Nav
  document.getElementById("mobile-user-name").innerText = name;
  const mobImg = document.getElementById("mobile-user-img");
  if (mobImg.src !== avatar) mobImg.src = avatar;
}
