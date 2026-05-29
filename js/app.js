// js/app.js - Dashboard və Sifarişlərin İdarəedilməsi

import Utils from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. AUTHENTİKASİYA YOXLANIŞI ---
  if (!Utils.isAuthenticated()) {
    window.location.replace("login.html");
    return;
  }

  // --- 2. QLOBAL DASHBOARD FUNKSİYALARI ---

  // İstifadəçi adını ekrana yazdırmaq
  const userNameDisplay = document.getElementById("userNameDisplay");
  if (userNameDisplay) {
    userNameDisplay.textContent =
      localStorage.getItem("bizplan_user_name") || "Sahibkar";
  }

  // Çıxış (Logout) Məntiqi
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("bizplan_token");
      localStorage.removeItem("bizplan_user_name");
      window.location.replace("login.html");
    });
  }

  // --- 3. DASHBOARD CƏDVƏLİNİN DOLDURULMASI ---
  const ordersTableBody = document.getElementById("ordersTableBody");
  if (ordersTableBody) {
    // Bu data gələcəkdə Google Sheets və ya DB-dən gələcək (JSON strukturuna uyğundur)
    const mockOrders = [
      {
        id: "#ORD-092",
        name: "Smart Green City",
        sector: "Ekoloji Sistemlər",
        date: "25 May 2026",
        status: "pending",
      },
      {
        id: "#ORD-091",
        name: "AgroTech Baku",
        sector: "Kənd Təsərrüfatı",
        date: "20 May 2026",
        status: "completed",
      },
      {
        id: "#ORD-090",
        name: "SaaS Builder",
        sector: "Texnologiya",
        date: "15 May 2026",
        status: "completed",
      },
    ];

    mockOrders.forEach((order) => {
      const isCompleted = order.status === "completed";
      const badgeClass = isCompleted ? "badge-success" : "badge-pending";
      const statusText = isCompleted ? "Hazırdır" : "Analiz edilir";
      const actionBtn = isCompleted
        ? `<button class="btn btn-primary" style="padding: 8px 16px; font-size: 0.85rem;">Yüklə 📥</button>`
        : `<button class="btn btn-outline" style="padding: 8px 16px; font-size: 0.85rem;" disabled>Gözlənilir</button>`;

      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td style="font-weight: 500; color: var(--text-muted);">${order.id}</td>
                <td style="font-weight: 600;">${order.name}</td>
                <td>${order.sector}</td>
                <td style="color: var(--text-muted);">${order.date}</td>
                <td><span class="badge ${badgeClass}">${statusText}</span></td>
                <td>${actionBtn}</td>
            `;
      ordersTableBody.appendChild(tr);
    });
  }

  // --- 4. YENİ SİFARİŞ (NEW ORDER) MƏNTİQİ ---
  const newOrderForm = document.getElementById("newOrderForm");
  if (newOrderForm) {
    // A. Söz Sayğacı və Validasiya
    const descriptionArea = document.getElementById("bizDescription");
    const wordCounter = document.getElementById("wordCounter");
    const submitBtn = document.getElementById("submitOrderBtn");
    const minWords = 300;
    const maxWords = 3000;

    descriptionArea.addEventListener("input", (e) => {
      const text = e.target.value.trim();
      const wordCount = text ? text.split(/\s+/).length : 0;

      wordCounter.textContent = `${wordCount} / ${maxWords} söz`;

      if (wordCount < minWords) {
        wordCounter.style.color = "var(--danger)";
        submitBtn.disabled = true;
      } else if (wordCount > maxWords) {
        wordCounter.style.color = "var(--danger)";
        submitBtn.disabled = true;
      } else {
        wordCounter.style.color = "var(--success)";
        submitBtn.disabled = false;
      }
    });

    // B. Drag & Drop Fayl Yükləmə Sistemi
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");
    const fileListContainer = document.getElementById("fileList");
    let uploadedFiles = [];

    dropZone.addEventListener("click", () => fileInput.click());

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      dropZone.addEventListener(eventName, () =>
        dropZone.classList.add("dragover"),
      );
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropZone.addEventListener(eventName, () =>
        dropZone.classList.remove("dragover"),
      );
    });

    dropZone.addEventListener("drop", (e) => handleFiles(e.dataTransfer.files));
    fileInput.addEventListener("change", function () {
      handleFiles(this.files);
    });

    function handleFiles(files) {
      const newFiles = Array.from(files);
      const blockedExts = ["exe", "bat", "js", "sh"];

      for (let file of newFiles) {
        const ext = file.name.split(".").pop().toLowerCase();
        if (blockedExts.includes(ext)) {
          Utils.showToast(`Xəta: .${ext} faylı qadağandır!`, "error");
          continue;
        }
        if (file.size > 25 * 1024 * 1024) {
          Utils.showToast(`${file.name} 25MB-dan böyükdür!`, "error");
          continue;
        }
        uploadedFiles.push(file);
      }
      renderFiles();
    }

    function renderFiles() {
      fileListContainer.innerHTML = "";
      uploadedFiles.forEach((file, index) => {
        const div = document.createElement("div");
        div.className = "file-item";
        div.innerHTML = `
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <span>📄</span>
                        <div>
                            <div style="font-weight: 500; font-size: 0.9rem;">${file.name}</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">${(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                        </div>
                    </div>
                    <button type="button" onclick="removeFile(${index})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 1.2rem;">&times;</button>
                `;
        fileListContainer.appendChild(div);
      });
    }

    window.removeFile = (index) => {
      uploadedFiles.splice(index, 1);
      renderFiles();
    };

    // C. Formun Göndərilməsi (API Simulyasiyası)
    newOrderForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML =
        'Data Şifrələnir və Göndərilir... <span style="animation: spin 1s linear infinite;">⏳</span>';
      submitBtn.disabled = true;

      const formData = Utils.getFormDataAsJSON(newOrderForm);

      setTimeout(() => {
        console.log("Göndəriləcək Data (JSON):", formData);
        console.log("Qoşma Fayllar:", uploadedFiles);

        Utils.showToast(
          "Sifarişiniz qəbul edildi! Analizə başlanılır.",
          "success",
        );

        setTimeout(() => {
          window.location.replace("dashboard.html");
        }, 2000);
      }, 2000);
    });
  }
});
