// 1. INITIALIZATION
window.onload = () => {
  triggerCongratulations();
  initAnimations();
  setupMobileMenu();
  setupTheme();
  animateStats();
  initBackgroundTilt();
};

// 2. WINNER MODAL & FLOWER CONFETTI
function triggerCongratulations() {
  const modal = document.getElementById("winModal");
  modal.style.display = "flex";

  // GSAP Modal Pop
  gsap.from(".modal-body", {
    scale: 0.5,
    opacity: 0,
    duration: 1,
    ease: "elastic.out(1, 0.5)",
  });

  // Burst Flowers/Confetti
  var end = Date.now() + 4 * 1000;
  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#3b82f6", "#06b6d4", "#ffffff"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#3b82f6", "#06b6d4", "#ffffff"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function closeModal() {
  gsap.to(".modal-wrap", {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      document.getElementById("winModal").style.display = "none";
    },
  });
}

// 4. GSAP ENTRANCE ANIMATIONS
function initAnimations() {
  gsap.utils.toArray(".gsap-reveal").forEach((elem) => {
    gsap.from(elem, {
      scrollTrigger: {
        trigger: elem,
        start: "top 85%",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  });
}

// 5. MOBILE MENU LOGIC
function setupMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  btn.onclick = () => {
    menu.classList.toggle("open");
    btn.classList.toggle("active");
  };
}

// 6. THEME TOGGLE
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

const btn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) btn.classList.add("visible");
  else btn.classList.remove("visible");
});
btn.onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 7. STATS COUNTER ANIMATION
function animateStats() {
  const stats = document.querySelectorAll(".stat-item h4");
  stats.forEach((stat) => {
    const target = +stat.getAttribute("data-target");
    const inc = target / 100;
    let count = 0;
    const updateCount = () => {
      count += inc;
      if (count < target) {
        stat.innerText = Math.ceil(count) + "+";
        requestAnimationFrame(updateCount);
      } else {
        stat.innerText = target + "+";
      }
    };
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) updateCount();
    });
    observer.observe(stat);
  });
}

// 8. BACKGROUND TILT (Deep Curve Effect)
function initBackgroundTilt() {
  const bg = document.querySelector(".background-animation");
  if (!bg) return;

  // Mouse Tilt (Desktop)
  document.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;

    // Inverse direction for "deep" feel
    // Limited rotation to prevent edges showing
    const rY = -x * 8;
    const rX = y * 8;

    bg.style.transform = `perspective(1000px) translateZ(-50px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.05)`;
  });

  // Device Tilt (Mobile)
  window.addEventListener("deviceorientation", (e) => {
    if (e.beta === null || e.gamma === null) return;

    // Clamp and Inverse
    const rX = Math.max(-10, Math.min(10, e.beta / 4));
    const rY = Math.max(-10, Math.min(10, -e.gamma / 4));

    bg.style.transform = `perspective(1000px) translateZ(-50px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.05)`;
  });
}

// 9. ROBOT ANIMATION LOGIC
(function () {
  const robotScene = document.getElementById("robot-scene");
  const pupilL = document.getElementById("pupil-l");
  const pupilR = document.getElementById("pupil-r");
  const antennaL = document.getElementById("antenna-l");
  const antennaR = document.getElementById("antenna-r");
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
    const rotY = current.x * 15;
    const rotX = -current.y * 15;
    if (robotScene)
      robotScene.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;
    requestAnimationFrame(animateRobot);
  }
  animateRobot();
})();
