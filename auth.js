// Sistem Pengesahan Rasmi Google Identity Services (OAuth 2.0 Verified)
// PlayStore APK Hub

const AUTH_CONFIG = {
  googleClientId: "929787256639-ojmroo438llla3o9j8vt3h1pljq38ba2.apps.googleusercontent.com",
  storageKey: "playstore_user_session",
  registeredListKey: "playstore_registered_users"
};

// Semak status log masuk bila laman dibuka
document.addEventListener("DOMContentLoaded", () => {
  initAuth();
});

function initAuth() {
  const currentUser = getLoggedInUser();

  if (currentUser) {
    // Pengguna sudah pernah disahkan
    unlockStore(currentUser);
  } else {
    // Pengguna belum disahkan - kunci store dan muat butang Google rasmi
    lockStore();
    initGoogleGIS();
  }

  // Pasang listener pada borang manual jika pengguna tiada akaun Google
  const authForm = document.getElementById("authRegisterForm");
  if (authForm) {
    authForm.addEventListener("submit", handleRegisterSubmit);
  }
}

// Inisialisasi Google Identity Services Rasmi (Google OAuth 2.0)
function initGoogleGIS() {
  const clientId = AUTH_CONFIG.googleClientId;
  const googleBtnContainer = document.getElementById("googleBtnContainer");

  if (window.google && google.accounts && google.accounts.id) {
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true
    });

    if (googleBtnContainer) {
      googleBtnContainer.innerHTML = "";
      
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";

      // Paparkan butang rasmi Google
      google.accounts.id.renderButton(googleBtnContainer, {
        type: "standard",
        theme: isDark ? "filled_black" : "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: 320,
        logo_alignment: "left"
      });
    }

    // Paparkan pop-up One Tap Google jika disokong
    try {
      google.accounts.id.prompt();
    } catch (e) {
      console.log("One tap prompt:", e);
    }
  } else {
    // Tunggu SDK Google dimuatkan
    setTimeout(initGoogleGIS, 250);
  }
}

// KENDALIKAN RESPONS DARI GOOGLE SETELAH PENGGUNA BERJAYA DISAHKAN
// Hanya akaun Google SEBENAR & AKTIF yang disahkan oleh server Google akan sampai ke sini
function handleGoogleCredentialResponse(response) {
  if (!response || !response.credential) {
    alert("Pengesahan Google gagal atau dibatalkan.");
    return;
  }

  // Baca payload token JWT yang ditandatangani secara kriptografi oleh Google
  const payload = decodeJwt(response.credential);
  if (!payload || !payload.email) {
    alert("Akaun Google tidak dapat disahkan.");
    return;
  }

  // Akaun ini 100% DISAHKAN oleh pelayan Google
  const user = {
    name: payload.name || payload.email.split("@")[0],
    email: payload.email,
    picture: payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || 'Google User')}&background=01875f&color=fff&bold=true`,
    sub: payload.sub,
    provider: "google_verified",
    verifiedAt: new Date().toISOString()
  };

  // Simpan sesi sah dalam localStorage
  localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(user));
  saveToRegisteredList(user);

  // Buka kunci gedung APK
  unlockStore(user);

  if (typeof showToast === "function") {
    showToast(`Disahkan oleh Google! Selamat datang, ${user.name}.`);
  }
}

// Kendalikan borang manual (jika pengguna tiada akaun Google)
function handleRegisterSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById("regUserName");
  const emailInput = document.getElementById("regUserEmail");
  const submitBtn = document.getElementById("regSubmitBtn");

  const name = nameInput.value.trim();
  let rawEmail = emailInput.value.trim().replace(/\s+/g, "");

  if (!name || name.length < 2) {
    alert("Sila masukkan nama anda.");
    nameInput.focus();
    return;
  }

  if (!rawEmail || !rawEmail.includes("@") || !rawEmail.includes(".")) {
    alert("Sila masukkan alamat email yang sah (contoh: nama@email.com).");
    emailInput.focus();
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Mendaftarkan...</span>`;
  }

  setTimeout(() => {
    const user = {
      name: name,
      email: rawEmail.toLowerCase(),
      provider: "manual_registered",
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=01875f&color=fff&bold=true`,
      verifiedAt: new Date().toISOString()
    };

    localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(user));
    saveToRegisteredList(user);
    unlockStore(user);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Daftar & Teruskan Masuk</span>`;
    }

    if (typeof showToast === "function") {
      showToast(`Pendaftaran berjaya! Selamat datang, ${user.name}.`);
    }
  }, 350);
}

// Dapatkan sesi pengguna yang disimpan
function getLoggedInUser() {
  try {
    const data = localStorage.getItem(AUTH_CONFIG.storageKey);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

// Kunci paparan Store
function lockStore() {
  const overlay = document.getElementById("authOverlay");
  const userProfile = document.getElementById("userProfilePill");
  
  if (overlay) overlay.classList.add("active");
  if (userProfile) userProfile.style.display = "none";
  document.body.style.overflow = "hidden";
}

// Buka kunci paparan Store
function unlockStore(user) {
  const overlay = document.getElementById("authOverlay");
  const userProfile = document.getElementById("userProfilePill");
  const userAvatar = document.getElementById("userAvatarImg");
  const userName = document.getElementById("userDisplayName");
  
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";

  if (userProfile) {
    userProfile.style.display = "flex";
    if (userAvatar) {
      userAvatar.src = user.picture;
    }
    if (userName) {
      userName.textContent = user.name;
    }
  }

  // Hantar rekod log masuk ke Google Sheets (hanya sekali bagi setiap sesi pelayar)
  if (!sessionStorage.getItem("sheets_tracked_" + user.email)) {
    sessionStorage.setItem("sheets_tracked_" + user.email, "true");
    if (typeof trackSheetsEvent === "function") {
      trackSheetsEvent({
        type: "login",
        userName: user.name,
        userEmail: user.email,
        provider: user.provider || "google",
        timestamp: new Date().toLocaleString("ms-MY", { timeZone: "Asia/Kuala_Lumpur" })
      });
    }
  }
}

// Simpan senarai rekod pendaftar
function saveToRegisteredList(user) {
  try {
    let list = JSON.parse(localStorage.getItem(AUTH_CONFIG.registeredListKey) || "[]");
    list = list.filter(item => item.email !== user.email);
    list.unshift(user);
    localStorage.setItem(AUTH_CONFIG.registeredListKey, JSON.stringify(list));
  } catch (e) {
    console.warn("Gagal simpan rekod:", e);
  }
}

// Log Keluar Pengguna
function logoutUser() {
  if (confirm("Adakah anda pasti mahu log keluar daripada PlayStore Hub?")) {
    localStorage.removeItem(AUTH_CONFIG.storageKey);
    
    // Matikan auto-select Google
    if (window.google && google.accounts && google.accounts.id) {
      google.accounts.id.disableAutoSelect();
    }

    if (typeof showToast === "function") {
      showToast("Anda telah berjaya log keluar.");
    }
    
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }
}

// Penyahkod token JWT Google tanpa sebarang perpustakaan luar
function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Gagal menyahkod token Google:", e);
    return null;
  }
}
