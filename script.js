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

/** Theme */
function getSavedTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) return saved;

  // If user never selected theme, use OS preference
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(theme) {
  if (theme === "light") {
    root.setAttribute("data-theme", "light");
    themeBtn?.querySelector(".icon") && (themeBtn.querySelector(".icon").textContent = "☀");
  } else {
    root.removeAttribute("data-theme");
    themeBtn?.querySelector(".icon") && (themeBtn.querySelector(".icon").textContent = "☾");
  }
  localStorage.setItem("theme", theme);
}

applyTheme(getSavedTheme());

themeBtn?.addEventListener("click", () => {
  const current = localStorage.getItem("theme") || getSavedTheme();
  applyTheme(current === "dark" ? "light" : "dark");
});

/** Toast */
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

/** Clipboard */
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
  if (!email) return;
  copyToClipboard(email);
});

/** Drawer */
function openDrawer() {
  if (!drawer || !backdrop) return;
  drawer.classList.add("open");
  backdrop.classList.add("show");
  drawer.setAttribute("aria-hidden", "false");
  backdrop.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  menuBtn?.setAttribute("aria-expanded", "true");
  closeDrawerBtn?.focus();
}

function closeDrawer() {
  if (!drawer || !backdrop) return;
  drawer.classList.remove("open");
  backdrop.classList.remove("show");
  drawer.setAttribute("aria-hidden", "true");
  backdrop.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  menuBtn?.setAttribute("aria-expanded", "false");
  menuBtn?.focus();
}

menuBtn?.addEventListener("click", openDrawer);
closeDrawerBtn?.addEventListener("click", closeDrawer);
backdrop?.addEventListener("click", closeDrawer);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && drawer?.classList.contains("open")) closeDrawer();
});

document.querySelectorAll(".drawer-link").forEach(a => {
  a.addEventListener("click", () => closeDrawer());
});

/** Smooth focus on section change (keeps your behavior) */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", () => {
    const id = a.getAttribute("href");
    const target = document.querySelector(id);
    if (!target) return;

    setTimeout(() => {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.removeAttribute("tabindex");
    }, 350);
  });
});

/** Reveal on scroll (unobserve for performance) */
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("show");
    io.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/** Contact form -> mailto (with validation + toast) */
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(contactForm);

  const name = (fd.get("name") || "").toString().trim();
  const email = (fd.get("email") || "").toString().trim();
  const message = (fd.get("message") || "").toString().trim();

  if (!name || !email || !message) {
    showToast("Please fill in all fields.");
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    showToast("Please enter a valid email.");
    return;
  }

  const subject = encodeURIComponent(`Portfolio Inquiry — ${name}`);
  const body = encodeURIComponent(
`Hello Soren,

Name: ${name}
Email: ${email}

Message:
${message}

Thanks!`
  );

  showToast("Opening your email app…");
  window.location.href = `mailto:sorenly333@gmail.com?subject=${subject}&body=${body}`;
});
/* Back to Top Button */

const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

  if (window.scrollY > 400) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }

});

backToTopBtn.addEventListener("click", () => {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

});

/* Welcome Popup - show on every load/refresh */
const welcomePopup = document.getElementById("welcomePopup");
const closeWelcome = document.getElementById("closeWelcome");

window.addEventListener("load", () => {
  if (!welcomePopup) return;
  // small delay for nicer UX
  setTimeout(() => {
    welcomePopup.classList.add("show");
    welcomePopup.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }, 500);
});

function hideWelcome() {
  welcomePopup.classList.remove("show");
  welcomePopup.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

closeWelcome?.addEventListener("click", hideWelcome);

// Optional: click outside to close
welcomePopup?.addEventListener("click", (e) => {
  if (e.target === welcomePopup) hideWelcome();
});

// Optional: ESC to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && welcomePopup?.classList.contains("show")) hideWelcome();
});

/* Color Palette */

const paletteBtn = document.getElementById("paletteBtn");
const palettePanel = document.getElementById("palettePanel");
const paletteOptions = document.querySelectorAll(".palette-option");

/* Toggle palette */
paletteBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  palettePanel.classList.toggle("show");
});

/* Select color */
paletteOptions.forEach(btn => {

  btn.addEventListener("click", () => {

    const color = btn.dataset.color;

    document.documentElement.style.setProperty("--accent", color);

    localStorage.setItem("accentColor", color);

    palettePanel.classList.remove("show"); // close after selection

  });

});

/* Load saved color */

const savedColor = localStorage.getItem("accentColor");

if(savedColor){
  document.documentElement.style.setProperty("--accent", savedColor);
}

/* Close when clicking outside */

document.addEventListener("click", (e) => {

  if (!palettePanel.contains(e.target) && e.target !== paletteBtn) {
    palettePanel.classList.remove("show");
  }

});

/* Close when scrolling */

window.addEventListener("scroll", () => {
  palettePanel.classList.remove("show");
});

/* Close with ESC */

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    palettePanel.classList.remove("show");
  }
});

/* Chatbot + Pricing Popup */
const chatFab = document.getElementById("chatFab");
const chatWidget = document.getElementById("chatWidget");
const chatCloseBtn = document.getElementById("chatCloseBtn");
const openPricingBtn = document.getElementById("openPricingBtn");

const pricingPopup = document.getElementById("pricingPopup");
const pricingCloseBtn = document.getElementById("pricingCloseBtn");

function openChat() {
  chatWidget.classList.add("show");
  chatWidget.setAttribute("aria-hidden", "false");
}

function closeChat() {
  chatWidget.classList.remove("show");
  chatWidget.setAttribute("aria-hidden", "true");
}

function openPricingPopup() {
  pricingPopup.classList.add("show");
  pricingPopup.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closePricingPopup() {
  pricingPopup.classList.remove("show");
  pricingPopup.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

chatFab?.addEventListener("click", () => {
  // toggle chat
  if (chatWidget.classList.contains("show")) closeChat();
  else openChat();
});

chatCloseBtn?.addEventListener("click", closeChat);

openPricingBtn?.addEventListener("click", () => {
  openPricingPopup();
});

pricingCloseBtn?.addEventListener("click", closePricingPopup);

// Close pricing popup when clicking outside the card
pricingPopup?.addEventListener("click", (e) => {
  if (e.target === pricingPopup) closePricingPopup();
});

// Close on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (pricingPopup?.classList.contains("show")) closePricingPopup();
    if (chatWidget?.classList.contains("show")) closeChat();
  }
});

// Optional: hide chat panel when user scrolls (feels cleaner)
window.addEventListener("scroll", () => {
  closeChat();
});

document.querySelectorAll('a[href="#pricing"]').forEach(link => {

  link.addEventListener("click", () => {

    if (pricingPopup.classList.contains("show")) {
      closePricingPopup();
    }

  });

});