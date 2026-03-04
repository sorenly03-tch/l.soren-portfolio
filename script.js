const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const menuBtn = document.getElementById("menuBtn");
const drawer = document.getElementById("drawer");
const backdrop = document.getElementById("backdrop");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");
const toast = document.getElementById("toast");
const copyEmailBtn = document.getElementById("copyEmailBtn");
const year = document.getElementById("year");
const contactForm = document.getElementById("contactForm");

year.textContent = new Date().getFullYear();

function getSavedTheme() {
  return localStorage.getItem("theme") || "dark";
}

function applyTheme(theme) {
  if (theme === "light") {
    root.setAttribute("data-theme", "light");
    themeBtn.querySelector(".icon").textContent = "☀";
  } else {
    root.removeAttribute("data-theme");
    themeBtn.querySelector(".icon").textContent = "☾";
  }
  localStorage.setItem("theme", theme);
}

applyTheme(getSavedTheme());

themeBtn.addEventListener("click", () => {
  const current = getSavedTheme();
  applyTheme(current === "dark" ? "light" : "dark");
});

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard ✅");
  } catch {
    showToast("Copy failed. Please copy manually.");
  }
}

copyEmailBtn?.addEventListener("click", () => {
  const email = copyEmailBtn.dataset.copy;
  copyToClipboard(email);
});

// Drawer
function openDrawer() {
  drawer.classList.add("open");
  backdrop.classList.add("show");
  drawer.setAttribute("aria-hidden", "false");
  backdrop.setAttribute("aria-hidden", "false");
}
function closeDrawer() {
  drawer.classList.remove("open");
  backdrop.classList.remove("show");
  drawer.setAttribute("aria-hidden", "true");
  backdrop.setAttribute("aria-hidden", "true");
}
menuBtn?.addEventListener("click", openDrawer);
closeDrawerBtn?.addEventListener("click", closeDrawer);
backdrop?.addEventListener("click", closeDrawer);

document.querySelectorAll(".drawer-link").forEach(a => {
  a.addEventListener("click", () => closeDrawer());
});

// Smooth focus highlight on section change (optional)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const target = document.querySelector(id);
    if (!target) return;

    // default smooth scroll is handled by CSS, but we keep this to close drawer, etc.
    setTimeout(() => {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.removeAttribute("tabindex");
    }, 350);
  });
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Contact form -> mailto
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(contactForm);
  const name = (fd.get("name") || "").toString().trim();
  const email = (fd.get("email") || "").toString().trim();
  const message = (fd.get("message") || "").toString().trim();

  const subject = encodeURIComponent(`Portfolio Inquiry — ${name}`);
  const body = encodeURIComponent(
`Hello Soren,

Name: ${name}
Email: ${email}

Message:
${message}

Thanks!`
  );

  window.location.href = `mailto:sorenly333@gmail.com?subject=${subject}&body=${body}`;
});