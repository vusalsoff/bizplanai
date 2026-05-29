// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  // --- MOCK DATA (Gələcəkdə Backend API-dən gələcək) ---
  const mockOrders = [
    {
      id: "#ORD-001",
      name: "EcoFarm Tech",
      sector: "Aqrar",
      date: "25 May 2026",
      status: "hazırlanır",
    },
    {
      id: "#ORD-002",
      name: "GreenCity AI",
      sector: "Texnologiya",
      date: "22 May 2026",
      status: "hazırdır",
    },
    {
      id: "#ORD-003",
      name: "Baku Logistics",
      sector: "Xidmət",
      date: "15 May 2026",
      status: "hazırdır",
    },
  ];

  // --- 1. ROUTING & UI INITIALIZATION ---
  const currentPath = window.location.pathname;

  // Dashboard səhifəsidirsə cədvəli doldur
  if (currentPath.includes("dashboard.html")) {
    renderOrdersTable();
  }

  // --- 2. AUTHENTICATION LOGIC ---
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = loginForm.querySelector("button");
      btn.innerHTML = "Yoxlanılır...";
      btn.disabled = true;

      // Simulyasiya: 1 saniyə sonra dashboard-a yönləndir
      setTimeout(() => {
        localStorage.setItem("isAuthenticated", "true");
        window.location.href = "dashboard.html";
      }, 1000);
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("isAuthenticated");
      window.location.href = "login.html";
    });
  }

  // --- 3. DYNAMIC TABLE RENDERING (DASHBOARD & ADMIN) ---
  function renderOrdersTable() {
    const tbody = document.getElementById("ordersTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    mockOrders.forEach((order) => {
      // Status rəngini təyin et
      let badgeClass = "";
      let statusText = "";

      if (order.status === "hazırlanır") {
        badgeClass = "badge-warning";
        statusText = "Analiz edilir";
      } else if (order.status === "hazırdır") {
        badgeClass = "badge-success";
        statusText = "Tamamlanıb";
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td style="font-weight: 500; color: var(--text-secondary);">${order.id}</td>
                <td style="font-weight: 600;">${order.name}</td>
                <td>${order.sector}</td>
                <td style="color: var(--text-secondary);">${order.date}</td>
                <td><span class="badge ${badgeClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.85rem;">
                        ${order.status === "hazırdır" ? "Yüklə PDF" : "Bax"}
                    </button>
                </td>
            `;
      tbody.appendChild(tr);
    });
  }
});
// js/main.js - Mərkəzi UI Məntiqi

import Utils from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navbar Scroll Effekti
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(3, 7, 18, 0.9)';
                header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
            } else {
                header.style.background = 'transparent';
                header.style.boxShadow = 'none';
            }
        });
    }

    // 2. Auth State Check (Giriş etmiş istifadəçi Login səhifəsinə girə bilməz)
    const currentPath = window.location.pathname;
    if ((currentPath.includes('login.html') || currentPath.includes('register.html')) && Utils.isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }

    // Qlobal funksiyaları window obyektinə atırıq ki, HTML içində rahat istifadə edilsin (onclick və s.)
    window.Utils = Utils;
});