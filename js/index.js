// --- 1. NAVBAR VƏ MENU LOGİKASI ---

// FIX: mobileActions-a desktopButtons məzmununu kopiyala
const desktopButtons = document.getElementById("desktopButtons");
const mobileActions = document.getElementById("mobileActions");
if (desktopButtons && mobileActions) {
  mobileActions.innerHTML = desktopButtons.innerHTML;
}

// FIX: null yoxlaması əlavə edildi — element tapılmasa crash olmur
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function closeMenu() {
  if (menuToggle) menuToggle.classList.remove("active");
  if (navLinks) navLinks.classList.remove("active");
}

if (menuToggle && navLinks) {
  // Hamburger düyməsi — event bubble-ı dayandır ki outside-click ilə toqquşmasın
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Menyu içindəki hər linki kliklədikdə bağla
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Menyu xaricinə klik etdikdə bağla
  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      closeMenu();
    }
  });
}

// --- 2. SCROLL EFFEKTLƏRİ (BİRLƏŞDİRİLMİŞ — iki ayrı listener əvəzinə bir tane) ---
const navbar = document.getElementById("mainNavbar");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const floatContainer = document.getElementById("floatContainer");
const arrow = document.getElementById("pointingArrow");
const contactSection = document.getElementById("contact");
const statsSection = document.getElementById("stats");
const statNums = document.querySelectorAll(".stat-num");
let statsAnimated = false;

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  // Navbar scroll effekti
  if (navbar) {
    navbar.classList.toggle("scrolled", scrollY > 50);
  }

  // Scroll top düyməsi və floating container
  if (scrollY > 300) {
    if (scrollTopBtn) scrollTopBtn.classList.add("show");
    if (floatContainer) floatContainer.classList.add("scrolled-active");
  } else {
    if (scrollTopBtn) scrollTopBtn.classList.remove("show");
    if (floatContainer) floatContainer.classList.remove("scrolled-active");
  }

  // Contact oxu (arrow)
  if (arrow && contactSection) {
    const rect = contactSection.getBoundingClientRect();
    arrow.style.opacity =
      rect.top <= window.innerHeight / 2 && rect.bottom >= 100 ? "1" : "0";
  }

  // Stats counter animasiyası
  if (!statsAnimated && statsSection) {
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      startCounters();
      statsAnimated = true;
    }
  }
});

// Scroll top düyməsi klik
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// --- 3. TYPEWRITER ---
const el = document.getElementById("typewriterTitle");

// FIX: el null olduqda crash olmur
if (el) {
  const words = ["İdeyanızı ", "İnvestisiya ", "Cəlb Edən Plana Çevirin."];
  let wordIdx = 0,
    charIdx = 0,
    currentText = "";

  function typeEffect() {
    if (wordIdx < words.length) {
      const fullWord = words[wordIdx];
      const isShimmer = wordIdx === 1;
      charIdx++;
      const typed = fullWord.slice(0, charIdx);
      const segment = isShimmer
        ? `<span class="shimmer-text">${typed}</span>`
        : typed;
      el.innerHTML =
        currentText + segment + '<span class="typewriter-cursor">|</span>';
      if (charIdx < fullWord.length) {
        setTimeout(typeEffect, 90);
      } else {
        currentText += isShimmer
          ? `<span class="shimmer-text">${fullWord}</span>`
          : fullWord;
        charIdx = 0;
        wordIdx++;
        setTimeout(typeEffect, 150);
      }
    } else {
      el.innerHTML = currentText + '<span class="typewriter-cursor">|</span>';
    }
  }
  setTimeout(typeEffect, 400);
}

// --- 4. COUNTER ---
function startCounters() {
  statNums.forEach((num) => {
    const target = +num.getAttribute("data-target");
    let count = 0;
    const speed = target / 40;
    const suffix = target === 99 ? "%" : target === 12 ? "M+" : "+";

    const updateCount = () => {
      count += speed;
      if (count < target) {
        num.innerText = Math.ceil(count) + suffix;
        setTimeout(updateCount, 25);
      } else {
        num.innerText = target + suffix;
      }
    };
    updateCount();
  });
}

// --- 5. MODAL ---
const modalOverlay = document.getElementById("consultationOverlay");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const consultationForm = document.getElementById("consultationForm");
const formContent = document.getElementById("formContent");
const successContent = document.getElementById("successContent");

// Modal açmaq — bütün "open-cons-btn" düymələri üçün
document.body.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("open-cons-btn")) {
    if (formContent) formContent.classList.remove("hidden");
    if (successContent) successContent.classList.remove("active");
    if (consultationForm) consultationForm.reset();
    if (modalOverlay) modalOverlay.classList.add("active");
  }
});

// FIX: modalCloseBtn listener əlavə edildi (orijinalda yalnız dəyişən elan edilmişdi)
if (modalCloseBtn && modalOverlay) {
  modalCloseBtn.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
  });
}

// FIX: Overlay xaricinə klik etdikdə modalı bağla
if (modalOverlay) {
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove("active");
    }
  });
}

// FIX: Form submit — successContent göstər
if (consultationForm && formContent && successContent) {
  consultationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formContent.classList.add("hidden");
    successContent.classList.add("active");
  });
}
