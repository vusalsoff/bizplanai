// js/auth.js - Təhlükəsizlik və Doğrulama məntiqi

import Utils from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  // Əgər istifadəçi artıq sistemə daxil olubsa, onu birbaşa Dashboard-a yönləndir
  if (Utils.isAuthenticated()) {
    window.location.replace("dashboard.html");
    return;
  }

  // Qlobal status dəyişənləri
  window.isLoginSuccess = false;
  window.isRegisterSuccess = false;

  const modalOverlay = document.getElementById("alertModalOverlay");
  const alertIcon = document.getElementById("alertIcon");
  const alertTitle = document.getElementById("alertTitle");
  const alertDesc = document.getElementById("alertDesc");
  const alertCloseBtn = document.getElementById("alertCloseBtn");

  // Mərkəzi 3D Alert Açma funksiyası
  function triggerCenterAlert(type, title, description) {
    if (type === "success") {
      alertIcon.className = "alert-icon success";
      alertIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
      alertCloseBtn.className = "btn-alert-close success-btn";
      alertCloseBtn.innerText = "Davam et";
    } else {
      alertIcon.className = "alert-icon";
      alertIcon.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
      alertCloseBtn.className = "btn-alert-close";
      alertCloseBtn.innerText = "Anladım";
    }

    alertTitle.innerText = title;
    alertDesc.innerText = description;
    modalOverlay.classList.add("active");
  }

  // --- 1. QEYDİYYAT MƏNTİQİ ---
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    const fullNameInput = document.getElementById("regFullName");
    const emailInput = document.getElementById("regEmail");
    const phoneInput = document.getElementById("regPhone");
    const passwordInput = document.getElementById("regPassword");
    const confirmInput = document.getElementById("regConfirmPassword");
    const submitBtn = document.getElementById("regSubmitBtn");

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Boş xana yoxlanışı (Mərkəzi Alert)
      if (
        !fullNameInput.value.trim() ||
        !emailInput.value.trim() ||
        !phoneInput.value.trim() ||
        !passwordInput.value.trim() ||
        !confirmInput.value.trim()
      ) {
        triggerCenterAlert(
          "error",
          "Diqqət!",
          "Zəhmət olmasa, bütün xanaları tam doldurun.",
        );
        return;
      }

      // Şifrə uzunluğu yoxlanışı
      if (passwordInput.value.length < 8) {
        triggerCenterAlert(
          "error",
          "Zəif Şifrə!",
          "Şifrənizin uzunluğu minimum 8 simvoldan ibarət olmalıdır.",
        );
        return;
      }

      // Şifrə eyniliyi yoxlanışı
      if (passwordInput.value !== confirmInput.value) {
        triggerCenterAlert(
          "error",
          "Uyuşmazlıq!",
          "Daxil etdiyiniz şifrələr bir-biri ilə uyğun gəlmir.",
        );
        return;
      }

      const formData = Utils.getFormDataAsJSON(registerForm);
      submitBtn.innerHTML =
        'Hesab yaradılır... <span style="animation: spin 1s linear infinite;">⏳</span>';
      submitBtn.disabled = true;

      // Backend simulyasiyası (2 saniyə)
      setTimeout(() => {
        console.log("Qeydiyyat datası:", formData);

        // Token və istifadəçi adını LocalStorage-ə qeyd edirik
        localStorage.setItem("bizplan_token", "demo_jwt_token_123");
        localStorage.setItem(
          "bizplan_user_name",
          formData.fullName || "Sahibkar",
        );

        submitBtn.innerHTML = "Hesab Yarat";
        submitBtn.disabled = false;

        // Qeydiyyatın uğurlu olduğunu təsdiqləyirik
        window.isRegisterSuccess = true;
        triggerCenterAlert(
          "success",
          "Təbriklər!",
          "Hesabınız uğurla yaradıldı.",
        );
      }, 2000);
    });
  }

  // --- 2. GİRİŞ (LOGIN) MƏNTİQİ ---
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const emailInput = document.getElementById("loginEmail");
    const loginPasswordInput = document.getElementById("loginPassword");
    const submitBtn = document.getElementById("loginSubmitBtn");

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!emailInput.value.trim() || !loginPasswordInput.value.trim()) {
        triggerCenterAlert(
          "error",
          "Diqqət!",
          "Zəhmət olmasa, bütün xanaları tam doldurun.",
        );
        return;
      }

      const formData = Utils.getFormDataAsJSON(loginForm);
      submitBtn.innerHTML =
        'Yoxlanılır... <span style="animation: spin 1s linear infinite;">⏳</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        if (formData && formData.password && formData.password.length >= 8) {
          localStorage.setItem("bizplan_token", "demo_jwt_token_123");
          if (!localStorage.getItem("bizplan_user_name")) {
            localStorage.setItem("bizplan_user_name", "Sahibkar");
          }

          submitBtn.innerHTML = "Daxil ol";
          submitBtn.disabled = false;

          window.isLoginSuccess = true;
          triggerCenterAlert(
            "success",
            "Giriş Uğurludur!",
            "Maliyyə panelinizə uğurla daxil oldunuz.",
          );
        } else {
          triggerCenterAlert(
            "error",
            "Giriş Uğursuzdur!",
            "Daxil etdiyiniz email və ya şifrə yanlışdır (Şifrə min. 8 simvol olmalıdır).",
          );
          submitBtn.innerHTML = "Daxil ol";
          submitBtn.disabled = false;
        }
      }, 1500);
    });
  }

  // Qlobal spin animasiyası
  const style = document.createElement("style");
  style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
});
