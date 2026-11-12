// Main Application Logic for PlayStore APK Hub

let currentCategory = "all";
let currentSearchTerm = "";
let currentSelectedApp = null;
let qrCodeInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderHeroSlider();
  renderCatalog();
  setupEventListeners();
  checkUrlHash();
});

// Setup event listeners
function setupEventListeners() {
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  // Search input handler
  searchInput.addEventListener("input", (e) => {
    currentSearchTerm = e.target.value.trim().toLowerCase();
    if (currentSearchTerm.length > 0) {
      clearSearchBtn.style.display = "block";
    } else {
      clearSearchBtn.style.display = "none";
    }
    renderCatalog();
  });

  // Clear search button
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    currentSearchTerm = "";
    clearSearchBtn.style.display = "none";
    searchInput.focus();
    renderCatalog();
  });

  // Theme toggle
  themeToggleBtn.addEventListener("click", toggleTheme);

  // Keyboard shortcut (Escape to close modals)
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeQrModal();
      closeInstallGuideModal();
    }
  });

  // Handle URL hash changes
  window.addEventListener("hashchange", checkUrlHash);
}

// Render Featured Hero Carousel
function renderHeroSlider() {
  const heroSlider = document.getElementById("heroSlider");
  const heroSection = document.getElementById("heroSection");
  
  const featuredApps = APPS_DATA.filter(app => app.featured);
  if (!featuredApps.length) {
    heroSection.style.display = "none";
    return;
  }

  heroSlider.innerHTML = featuredApps.map(app => `
    <div class="hero-card" style="background: ${app.bannerColor || 'linear-gradient(135deg, #1e293b, #0f172a)'}" onclick="openAppModal('${app.id}')">
      <div class="hero-card-header">
        <span class="hero-badge">${app.badge || 'Pilihan Utama'}</span>
        <img src="${app.icon}" alt="${app.name}" class="hero-icon">
      </div>
      <div>
        <h3 class="hero-title">${app.name}</h3>
        <p class="hero-desc">${app.subtitle}</p>
      </div>
      <div class="hero-footer">
        <div class="hero-meta">
          <span>⭐ ${app.rating}</span>
          <span>&bull;</span>
          <span>${app.fileSize}</span>
        </div>
        <button class="btn-hero-download" onclick="event.stopPropagation(); triggerDownload('${app.id}');">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Pasang
        </button>
      </div>
    </div>
  `).join("");
}

// Filter apps by Category
function filterByCategory(category) {
  currentCategory = category;
  
  // Update category tab buttons UI
  document.querySelectorAll(".tab-btn").forEach(btn => {
    if (btn.dataset.category === category) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Update Catalog title
  const catalogTitle = document.getElementById("catalogTitle");
  const heroSection = document.getElementById("heroSection");

  if (category === "all") {
    catalogTitle.textContent = "Semua Aplikasi";
    if (heroSection) heroSection.style.display = currentSearchTerm ? "none" : "block";
  } else {
    const categoryNames = {
      navigasi: "Aplikasi Navigasi & GPS",
      hiburan: "Aplikasi Hiburan & TV",
      komunikasi: "Aplikasi Komunikasi & Suara",
      utiliti: "Aplikasi Utiliti & Kamera"
    };
    catalogTitle.textContent = categoryNames[category] || "Aplikasi";
    if (heroSection) heroSection.style.display = "none";
  }

  renderCatalog();
}

// Render Main App Catalog Grid
function renderCatalog() {
  const appsGrid = document.getElementById("appsGrid");
  const noResults = document.getElementById("noResults");
  const catalogCount = document.getElementById("catalogCount");
  const heroSection = document.getElementById("heroSection");

  // Filter apps based on category and search
  let filtered = APPS_DATA.filter(app => {
    const matchCategory = currentCategory === "all" || app.category === currentCategory;
    const matchSearch = !currentSearchTerm || 
      app.name.toLowerCase().includes(currentSearchTerm) ||
      app.subtitle.toLowerCase().includes(currentSearchTerm) ||
      app.developer.toLowerCase().includes(currentSearchTerm) ||
      app.categoryName.toLowerCase().includes(currentSearchTerm) ||
      (app.highlights && app.highlights.some(h => h.toLowerCase().includes(currentSearchTerm)));

    return matchCategory && matchSearch;
  });

  if (currentSearchTerm && heroSection) {
    heroSection.style.display = "none";
  } else if (currentCategory === "all" && heroSection) {
    heroSection.style.display = "block";
  }

  catalogCount.textContent = `(${filtered.length} aplikasi)`;

  if (filtered.length === 0) {
    appsGrid.style.display = "none";
    noResults.style.display = "block";
    return;
  }

  appsGrid.style.display = "grid";
  noResults.style.display = "none";

  appsGrid.innerHTML = filtered.map(app => `
    <div class="app-card" onclick="openAppModal('${app.id}')">
      ${app.badge ? `<span class="app-badge-tag">${app.badge}</span>` : ""}
      <div class="app-card-top">
        <img src="${app.icon}" alt="${app.name}" class="app-icon" loading="lazy">
        <div class="app-info">
          <h3 class="app-name">${app.name}</h3>
          <div class="app-dev">${app.developer}</div>
          <span class="app-category">${app.categoryName}</span>
        </div>
      </div>

      <div class="app-meta-row">
        <div class="meta-item">
          <strong>${app.rating}</strong>
          <svg class="star-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
        <div class="meta-item">
          <span>${app.downloads}</span>
        </div>
        <div class="meta-item">
          <span>${app.fileSize}</span>
        </div>
      </div>

      <div class="app-card-actions">
        <button class="btn-download-apk" onclick="event.stopPropagation(); triggerDownload('${app.id}');">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Muat Turun
        </button>
        <button class="btn-details-icon" onclick="event.stopPropagation(); openAppModal('${app.id}');" title="Maklumat Lanjut">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
      </div>
    </div>
  `).join("");
}

// Open App Detail Modal
function openAppModal(appId) {
  const app = APPS_DATA.find(a => a.id === appId);
  if (!app) return;

  currentSelectedApp = app;

  // Set URL hash without scrolling
  history.replaceState(null, null, `#${app.id}`);

  document.getElementById("modalIcon").src = app.icon;
  document.getElementById("modalTitle").textContent = app.name;
  document.getElementById("modalDev").textContent = app.developer;
  document.getElementById("modalCategory").textContent = `${app.categoryName} • ${app.version}`;

  document.getElementById("modalRating").textContent = app.rating;
  document.getElementById("modalReviews").textContent = `${app.reviews} ulasan`;
  document.getElementById("modalDownloads").textContent = app.downloads;
  document.getElementById("modalAge").textContent = app.ageRating;
  document.getElementById("modalSize").textContent = app.fileSize;

  document.getElementById("modalDesc").textContent = app.description;

  // Features list
  const featuresContainer = document.getElementById("modalFeatures");
  featuresContainer.innerHTML = app.features.map(f => `<li>${f}</li>`).join("");

  // What's new
  document.getElementById("modalWhatsNew").textContent = app.whatsNew;

  // Technical table
  document.getElementById("modalPkgName").textContent = app.packageName;
  document.getElementById("modalVersion").textContent = app.version;
  document.getElementById("modalMinAndroid").textContent = app.minAndroid;
  document.getElementById("modalFileSize").textContent = app.fileSize;
  document.getElementById("modalDeveloper").textContent = app.developer;

  // Download button
  const downloadBtn = document.getElementById("modalDownloadBtn");
  downloadBtn.href = app.apkFile;
  downloadBtn.setAttribute("download", app.apkFile.split("/").pop());
  downloadBtn.onclick = (e) => {
    showToast(`Memulakan muat turun ${app.name} (${app.fileSize})...`);
  };

  document.getElementById("modalDownloadText").textContent = `Muat Turun APK (${app.fileSize})`;

  document.getElementById("appModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close Modal
function closeModal() {
  document.getElementById("appModal").classList.remove("active");
  document.body.style.overflow = "";
  if (window.location.hash) {
    history.replaceState(null, null, " ");
  }
}

function closeModalOnBackdrop(e) {
  if (e.target.id === "appModal") {
    closeModal();
  }
}

// Check URL Hash for direct app linking (e.g. index.html#tvkita)
function checkUrlHash() {
  const hash = window.location.hash.replace("#", "").trim();
  if (hash) {
    const matchedApp = APPS_DATA.find(a => a.id === hash);
    if (matchedApp) {
      openAppModal(matchedApp.id);
    }
  }
}

// Trigger direct download and show toast
function triggerDownload(appId) {
  const app = APPS_DATA.find(a => a.id === appId);
  if (!app) return;

  const link = document.createElement("a");
  link.href = app.apkFile;
  link.download = app.apkFile.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Memulakan muat turun ${app.name} (${app.fileSize})...`);
}

// Open QR Code popup for current app or whole store
function openQrForCurrentApp() {
  if (!currentSelectedApp) return;

  const qrAppTitle = document.getElementById("qrAppTitle");
  const qrContainer = document.getElementById("qrCodeContainer");
  const qrLinkText = document.getElementById("qrLinkText");

  qrAppTitle.textContent = `Imbas untuk Muat Turun ${currentSelectedApp.name}`;
  
  // Construct absolute URL
  const currentBase = window.location.href.split("#")[0].replace("index.html", "");
  const apkFullUrl = new URL(currentSelectedApp.apkFile, currentBase).href;

  qrLinkText.textContent = apkFullUrl;
  qrContainer.innerHTML = "";

  // Generate QR Code with qrcode.js
  if (typeof QRCode !== "undefined") {
    qrCodeInstance = new QRCode(qrContainer, {
      text: apkFullUrl,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
  } else {
    qrContainer.innerHTML = `<p style="color:#333; padding:10px;">Gunakan pautan: <br><strong>${apkFullUrl}</strong></p>`;
  }

  document.getElementById("qrModal").classList.add("active");
}

function closeQrModal() {
  document.getElementById("qrModal").classList.remove("active");
}

function closeQrModalOnBackdrop(e) {
  if (e.target.id === "qrModal") {
    closeQrModal();
  }
}

// Open Install Guide Modal
function openInstallGuideModal() {
  document.getElementById("installGuideModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeInstallGuideModal() {
  document.getElementById("installGuideModal").classList.remove("active");
  document.body.style.overflow = "";
}

function closeGuideModalOnBackdrop(e) {
  if (e.target.id === "installGuideModal") {
    closeInstallGuideModal();
  }
}

// Share current app link
function shareCurrentApp() {
  if (!currentSelectedApp) return;

  const currentBase = window.location.href.split("#")[0];
  const shareUrl = `${currentBase}#${currentSelectedApp.id}`;

  if (navigator.share) {
    navigator.share({
      title: currentSelectedApp.name,
      text: `Muat turun aplikasi ${currentSelectedApp.name} (${currentSelectedApp.subtitle})`,
      url: shareUrl
    }).catch(() => {});
  } else {
    // Copy to clipboard fallback
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast("Pautan aplikasi telah disalin ke papan keratan!");
    }).catch(() => {
      showToast(shareUrl);
    });
  }
}

// Show Toast notification
function showToast(message) {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3500);
}

// Theme management (Dark / Light)
function initTheme() {
  const savedTheme = localStorage.getItem("apk_store_theme") || "dark";
  applyTheme(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
  localStorage.setItem("apk_store_theme", newTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const iconDark = document.getElementById("themeIconDark");
  const iconLight = document.getElementById("themeIconLight");

  if (theme === "light") {
    if (iconDark) iconDark.style.display = "none";
    if (iconLight) iconLight.style.display = "block";
  } else {
    if (iconDark) iconDark.style.display = "block";
    if (iconLight) iconLight.style.display = "none";
  }
}
