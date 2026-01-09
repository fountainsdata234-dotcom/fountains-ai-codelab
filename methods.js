document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // GSAP Entry
  gsap.utils.toArray(".gsap-reveal").forEach((elem) => {
    gsap.from(elem, {
      scrollTrigger: {
        trigger: elem,
        start: "top 85%",
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
    });
  });

  setupMobileMenu();
  setupTheme();
});

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
