document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  // GSAP Reveal for the scheme
  gsap.utils.toArray(".gsap-reveal").forEach((elem) => {
    gsap.from(elem, {
      scrollTrigger: {
        trigger: elem,
        start: "top 85%",
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  });
  setupMobileMenu();
  setupTheme();
});

// Toggle Module Expansion
function toggleModule(element) {
  const card = element.parentElement;

  // Close other modules (optional - uncomment if you want only one open at a time)
  /*
    document.querySelectorAll('.module-card').forEach(c => {
        if(c !== card) c.classList.remove('active');
    });
    */

  card.classList.toggle("active");
}

// Copy to Clipboard logic
function copyPrompt(btn) {
  const code = btn.previousElementSibling.innerText;
  navigator.clipboard.writeText(code).then(() => {
    const originalText = btn.innerText;
    btn.innerText = "Copied!";
    btn.style.background = "#10b981";
    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.background = "rgba(255,255,255,0.1)";
    }, 2000);
  });
}

// Mobile Menu Logic
function setupMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      menu.classList.toggle("open");
      btn.classList.toggle("active");
    });
  }
}

// Theme Logic
function setupTheme() {
  const toggleTheme = (btn) => {
    // Dangling Animation
    if (btn && btn.classList.contains("icon-btn")) {
      btn.classList.remove("dangle-anim");
      void btn.offsetWidth; // trigger reflow
      btn.classList.add("dangle-anim");
    }
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("fnt-theme", isDark ? "dark" : "light");

    const mobileBtn = document.getElementById("themeToggleMobile");
    if (mobileBtn)
      mobileBtn.innerHTML = isDark
        ? "<span>Switch to Light</span> ☀️"
        : "<span>Switch to Dark</span> 🌓";
  };

  const btnDesktop = document.getElementById("themeToggle");
  const btnMobile = document.getElementById("themeToggleMobile");

  if (btnDesktop)
    btnDesktop.addEventListener("click", () => toggleTheme(btnDesktop));
  if (btnMobile)
    btnMobile.addEventListener("click", () => toggleTheme(btnMobile));

  if (localStorage.getItem("fnt-theme") === "dark") {
    document.body.classList.add("dark-theme");
    if (btnMobile) btnMobile.innerHTML = "<span>Switch to Light</span> ☀️";
  }
}
