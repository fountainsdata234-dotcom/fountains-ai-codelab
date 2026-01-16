// --- 1. LESSON DATA (8 LESSONS) ---
const lessons = [
  {
    num: "01",
    title: "Navigation Bar (Navbar)",
    video: "https://ik.imagekit.io/dking/lesson1.mp4?updatedAt=1768571046641", // Link or local file
    making: `<strong>What This Section Is</strong><br>The navigation bar is the control center of the website. It helps users move around the site.<br><br><strong>What It Usually Contains</strong><ul style="margin:10px 0 10px 20px;"><li>Logo (left or center)</li><li>Menu links (Home, About, Services, Contact)</li><li>Mobile menu (hamburger icon)</li><li>Active page indicator</li></ul><strong>Why This Section Is Important</strong><br>If users are confused about where to go, they leave. A clean navbar builds trust and professionalism immediately.<br><br><strong>Basic Effects to Know (No Heavy Animation Yet)</strong><ul style="margin:10px 0 10px 20px;"><li>Hover: text color changes</li><li>Active: underline or highlight current page</li><li>Sticky behavior (optional concept)</li></ul>`,
    prompt: `Create a clean, responsive navigation bar with a logo on the left and menu links on the right.\nInclude a mobile hamburger menu that changes to an X when clicked.\nAdd simple hover effects where the link color changes and an active state that shows the current page.`,
  },
  {
    num: "02",
    title: "Hero Section",
    video: "https://go.screenpal.com/watch/cOVIQEnrBgP",
    making: `<strong>What This Section Is</strong><br>This is the first big section users see. It answers one question immediately: “What is this website about?”<br><br><strong>What It Usually Contains</strong><ul style="margin:10px 0 10px 20px;"><li>Big headline (main message)</li><li>Short supporting text</li><li>Call-to-action button</li><li>Background image, video, or carousel</li></ul><strong>Why This Section Is Important</strong><br>You have 5 seconds to capture attention. If the hero section is weak, the user scrolls away or leaves.<br><br><strong>Basic Effects to Know</strong><ul style="margin:10px 0 10px 20px;"><li>Button hover (color or shadow)</li><li>Text emphasis</li><li>Simple overlay on image/video</li></ul>`,
    prompt: `Design a hero section with a clear headline, a short description, and a call-to-action button.\nUse a clean image or video background.\nAdd simple hover effects on the button and ensure the layout is responsive on mobile.`,
  },
  {
    num: "03",
    title: "Feature / Services Section",
    video: "video_local.mp4",
    making: `<strong>What This Section Is</strong><br>This section explains what the website or product can do.<br><br><strong>What It Usually Contains</strong><ul style="margin:10px 0 10px 20px;"><li>Cards or boxes</li><li>Icons or images</li><li>Short titles and descriptions</li></ul><strong>Why This Section Is Important</strong><br>This is where users understand the value of the website.<br><br><strong>Basic Effects to Know</strong><ul style="margin:10px 0 10px 20px;"><li>Card hover (slight lift or shadow)</li><li>Icon color change on hover</li></ul>`,
    prompt: `Create a feature section with three or four cards.\nEach card should have an icon, a title, and a short description.\nAdd a simple hover effect where the card slightly lifts or shows a soft shadow.`,
  },
  {
    num: "04",
    title: "Content / About Section",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    making: `<strong>What This Section Is</strong><br>This section builds trust and clarity. It explains who you are, what you do, or what the platform is about.<br><br><strong>What It Usually Contains</strong><ul style="margin:10px 0 10px 20px;"><li>Text content</li><li>Images or illustrations</li><li>Two-column layout (text + image)</li></ul><strong>Why This Section Is Important</strong><br>People don’t trust what they don’t understand. This section humanizes the website.<br><br><strong>Basic Effects to Know</strong><ul style="margin:10px 0 10px 20px;"><li>Image hover zoom (very subtle)</li><li>Text highlight or emphasis</li></ul>`,
    prompt: `Design an about section with a clean layout, using text on one side and an image on the other.\nKeep the design simple and readable.\nAdd a subtle hover effect on the image for visual interest.`,
  },
  {
    num: "05",
    title: "Call-To-Action (CTA) Section",
    video: "https://www.gstatic.com/adwords/publisher/images/firebase_hero.png",
    making: `<strong>What This Section Is</strong><br>This section tells the user what to do next.<br><br><strong>What It Usually Contains</strong><ul style="margin:10px 0 10px 20px;"><li>Short strong message</li><li>One main button</li><li>Simple background contrast</li></ul><strong>Why This Section Is Important</strong><br>Without a CTA, users don’t take action.<br><br><strong>Basic Effects to Know</strong><ul style="margin:10px 0 10px 20px;"><li>Button hover color</li><li>Button active state (slight press effect)</li></ul>`,
    prompt: `Create a call-to-action section with a short message and one primary button.\nUse a contrasting background color.\nAdd simple hover and active effects to the button.`,
  },
  {
    num: "06",
    title: "Testimonials / Social Proof Section",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    making: `<strong>What This Section Is</strong><br>This section shows other people’s experiences.<br><br><strong>What It Usually Contains</strong><ul style="margin:10px 0 10px 20px;"><li>User cards</li><li>Names or avatars</li><li>Short reviews</li></ul><strong>Why This Section Is Important</strong><br>People trust people. This increases credibility.<br><br><strong>Basic Effects to Know</strong><ul style="margin:10px 0 10px 20px;"><li>Card hover highlight</li><li>Carousel concept (static first)</li></ul>`,
    prompt: `Design a testimonial section with user cards showing short reviews and names.\nKeep the layout clean and readable.\nAdd a simple hover highlight effect on each card.`,
  },
  {
    num: "07",
    title: "Contact / Information Section",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    making: `<strong>What This Section Is</strong><br>This section tells users how to reach you.<br><br><strong>What It Usually Contains</strong><ul style="margin:10px 0 10px 20px;"><li>Email</li><li>Phone number</li><li>Address</li><li>Simple form (concept only)</li></ul><strong>Why This Section Is Important</strong><br>A website without contact info feels incomplete.<br><br><strong>Basic Effects to Know</strong><ul style="margin:10px 0 10px 20px;"><li>Input focus effect</li><li>Button hover</li></ul>`,
    prompt: `Create a contact section with basic contact information and a simple form layout.\nAdd focus effects on input fields and hover effects on the submit button.`,
  },
  {
    num: "08",
    title: "Footer (Final Section)",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    making: `<strong>What This Section Is</strong><br>The footer is the closing section of the website.<br><br><strong>What It Usually Contains</strong><ul style="margin:10px 0 10px 20px;"><li>Logo</li><li>Quick links</li><li>Social icons</li><li>Copyright text</li></ul><strong>Why This Section Is Important</strong><br>It completes the website and improves navigation.<br><br><strong>Basic Effects to Know</strong><ul style="margin:10px 0 10px 20px;"><li>Link hover</li><li>Icon hover color change</li></ul>`,
    prompt: `Design a footer with a logo, navigation links, social icons, and copyright text.\nAdd simple hover effects on links and icons.\nKeep the layout responsive and clean.`,
  },
];

// --- 2. RENDER ENGINE ---
function renderLessons() {
  const list = document.getElementById("lesson-list");
  list.innerHTML =
    lessons
      .map((l) => {
        const isVideo = l.video.match(/\.(mp4|webm|ogg)$/i);
        const mediaHTML = isVideo
          ? `<video src="${l.video}" controls preload="metadata" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;"></video>`
          : `<iframe src="about:blank" data-src="${l.video}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="width: 100%; height: 100%; border-radius: 8px;"></iframe>`;

        return `
                <div class="lesson-tab" id="tab-${l.num}">
                    <div class="tab-header" onclick="toggleLesson('${l.num}')">
                        <div class="lesson-title">
                            <span class="lesson-num">${l.num}</span>
                            <h3>Lesson ${parseInt(l.num)}: ${l.title}</h3>
                        </div>
                        <span class="chevron">▼</span>
                    </div>
                    
                    <div class="tab-content">
                        <div class="content-inner">
                            <div class="video-frame" style="width: 100%; aspect-ratio: 16/9; margin-bottom: 25px;">
                                ${mediaHTML}
                                <button class="landscape-btn" onclick="forceLandscape(this)">
                                    ⤢
                                </button>
                            </div>
                            <div class="making-box" style="width: 100%; margin-bottom: 25px;">
                                <h4>What we are making</h4>
                                <p>${l.making}</p>
                            </div>

                            <div class="prompt-container">
                                <div class="prompt-header">
                                    <span>AI COMMAND TERMINAL</span>
                                    <button class="copy-btn" onclick="copyPrompt('${
                                      l.num
                                    }')">Copy Command</button>
                                </div>
                                <div class="prompt-body">
                                    <div class="prompt-text" id="text-${
                                      l.num
                                    }">${l.prompt}</div>
                                </div>
                            </div>
                            <p class="lesson-note">(Note: this might not give u exactly wat u see)</p>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("") +
    `
            <div class="lesson-tab" style="opacity: 0.6; cursor: default;">
                <div class="tab-header">
                    <div class="lesson-title">
                        <span class="lesson-num" style="background: var(--text-secondary);">∞</span>
                        <h3>More Lessons Coming Soon...</h3>
                    </div>
                </div>
            </div>
        `;
}

// --- 3. UI LOGIC ---
function toggleLesson(num) {
  const allTabs = document.querySelectorAll(".lesson-tab");
  const targetTab = document.getElementById(`tab-${num}`);
  const isTargetActive = targetTab.classList.contains("active");

  // Close all tabs and stop videos
  allTabs.forEach((tab) => {
    tab.classList.remove("active");
    const iframe = tab.querySelector("iframe");
    if (iframe) iframe.src = "about:blank";
    const video = tab.querySelector("video");
    if (video) video.pause();
  });

  if (!isTargetActive) {
    targetTab.classList.add("active");
    const iframe = targetTab.querySelector("iframe");
    if (iframe && iframe.dataset.src) iframe.src = iframe.dataset.src;
    // Video tags don't need src reloading, they just need to be visible
  }
}

function copyPrompt(num) {
  const text = document.getElementById(`text-${num}`).innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector(`#tab-${num} .copy-btn`);
    btn.innerText = "Copied!";
    btn.style.background = "#10b981";
    setTimeout(() => {
      btn.innerText = "Copy Command";
      btn.style.background = "#3b82f6";
    }, 2000);
  });
}

function forceLandscape(btn) {
  const wrapper = btn.parentElement;
  wrapper.classList.toggle("rotated-mode");

  if (wrapper.classList.contains("rotated-mode")) {
    btn.innerHTML = "✕";
  } else {
    btn.innerHTML = "⤢";
  }
}

// --- 4. INITIALIZATION ---
window.onload = () => {
  renderLessons();
  gsap.from(".gsap-reveal", {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power4.out",
  });
  setupMobileMenu();
  setupTheme();
  setupBackToTop();
};

// --- 5. FIREBASE & UI LOGIC ---
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

auth.onAuthStateChanged((user) => {
  if (user) {
    db.collection("users")
      .doc(user.uid)
      .onSnapshot((doc) => {
        const data = doc.data() || {};
        const avatar =
          data.avatar ||
          user.photoURL ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
        const name = data.username || user.displayName || "Student";
        if (document.getElementById("nav-user-img"))
          document.getElementById("nav-user-img").src = avatar;
        if (document.getElementById("mobile-user-img"))
          document.getElementById("mobile-user-img").src = avatar;
        if (document.getElementById("mobile-user-name"))
          document.getElementById("mobile-user-name").innerText = name;
      });
  }
});

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
    localStorage.setItem(
      "fnt-theme",
      document.body.classList.contains("dark-theme") ? "dark" : "light"
    );
  };
  const btnDesktop = document.getElementById("themeToggle");
  const btnMobile = document.getElementById("themeToggleMobile");
  if (btnDesktop) btnDesktop.onclick = () => toggleTheme(btnDesktop);
  if (btnMobile) btnMobile.onclick = () => toggleTheme(btnMobile);
  if (localStorage.getItem("fnt-theme") === "dark")
    document.body.classList.add("dark-theme");
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

  // ROBOT ANIMATION
  (function () {
    const robotScene = document.getElementById("robot-scene");
    const pupilL = document.getElementById("pupil-l");
    const pupilR = document.getElementById("pupil-r");
    if (!robotScene) return;
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
}
