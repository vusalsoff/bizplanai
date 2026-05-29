// js/utils.js - Qlobal Köməkçi Funksiyalar

const Utils = {
  /**
   * Ekranda dinamik və premium bildirişlər (Toast) göstərir.
   * @param {string} message - Göstəriləcək mesaj
   * @param {string} type - 'success', 'error', 'warning'
   */
  showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    // İkonlar növə görə dəyişir
    const icon = type === "success" ? "✅" : type === "error" ? "❌" : "⚠️";

    toast.innerHTML = `
            <span style="font-size: 1.2rem;">${icon}</span>
            <span style="font-weight: 500;">${message}</span>
        `;

    container.appendChild(toast);

    // 4 saniyə sonra avtomatik silinir
    setTimeout(() => {
      toast.classList.add("fade-out");
      toast.addEventListener("animationend", () => toast.remove());
    }, 4000);
  },

  /**
   * Məbləğləri və ya rəqəmləri formatlayır (məs: 10,000)
   */
  formatNumber(num) {
    return new Intl.NumberFormat("az-AZ").format(num);
  },

  /**
   * Form datalarını JSON obyektinə çevirir (API üçün)
   */
  getFormDataAsJSON(formElement) {
    const formData = new FormData(formElement);
    const obj = {};
    formData.forEach((value, key) => (obj[key] = value));
    return obj;
  },

  /**
   * İstifadəçinin sistemə daxil olub-olmadığını yoxlayır
   */
  isAuthenticated() {
    return !!localStorage.getItem("bizplan_token");
  },
};

export default Utils;
