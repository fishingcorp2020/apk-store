// Sistem Dwi-Pendaftaran: Google SSO + Borang Manual
// PlayStore APK Hub

const AUTH_CONFIG = {
  // Jika anda mempunyai Google OAuth Client ID, masukkan di sini:
  googleClientId: "",
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
    // Pengguna sudah pernah daftar/log masuk
    unlockStore(currentUser);
  } else {
    // Pengguna belum daftar - kunci store dan paparkan pilihan
    lockStore();
    initGoogleAuth();
  }

  // Pasang listener pada borang pendaftaran manual
  const authForm = document.getElementById("authRegisterForm");
  if (authForm) {
    authForm.addEventListener("submit", handleRegisterSubmit);
  }
}

// Inisialisasi Google Identity Services (jika Client ID wujud)
function initGoogleAuth() {
  const clientId = AUTH_CONFIG.googleClientId || (typeof STORE_CONFIG !== "undefined" ? STORE_CONFIG.googleClientId : "");
  const googleBtnContainer = document.getElementById("googleBtnContainer");
  const googleCustomBtn = document.getElementById("googleCustomBtn");

  if (clientId && clientId.trim() !== "") {
    if (window.google && google.accounts && google.accounts.id) {
      google.accounts.id.initialize({
        client_id: clientId.trim(),
        callback: handleGoogleCredentialResponse,
        auto_select: false
      });

      if (googleBtnContainer) {
        googleBtnContainer.innerHTML = "";
        google.accounts.id.renderButton(googleBtnContainer, {
          theme: document.documentElement.getAttribute("data-theme") === "dark" ? "filled_black" : "outline",
          size: "large",
          shape: "pill",
          text: "signin_with",
          width: 320,
          logo_alignment: "left"
        });
      }

      if (googleCustomBtn) googleCustomBtn.style.display = "none";
    } else {
      setTimeout(initGoogleAuth, 300);
    }
  } else {
    // Paparkan butang kustom Google SSO
    if (googleCustomBtn) googleCustomBtn.style.display = "flex";
  }
}

// Tindakan bila pengguna klik butang Google SSO Kustom
function triggerGoogleSsoClick() {
  const clientId = AUTH_CONFIG.googleClientId || (typeof STORE_CONFIG !== "undefined" ? STORE_CONFIG.googleClientId : "");

  if (clientId && clientId.trim() !== "" && window.google && google.accounts) {
    google.accounts.id.prompt();
    return;
  }

  // Jika Client ID belum dihubungkan, mudahkan pengguna dengan log masuk pantas Gmail
  const emailInput = prompt("Log Masuk Google Pantas:\nMasukkan alamat Gmail anda (contoh: user@gmail.com):", "");
  if (!emailInput) return;

  const emailClean = emailInput.trim().toLowerCase();
  if (!emailClean.includes("@") || !emailClean.includes(".")) {
    alert("Sila masukkan alamat Gmail yang sah.");
    return;
  }

  const namePart = emailClean.split("@")[0];
  const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

  const user = {
    name: formattedName,
    email: emailClean,
    provider: "google",
    picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=01875f&color=fff&bold=true`,
    registeredAt: new Date().toISOString()
  };

  localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(user));
  saveToRegisteredList(user);
  unlockStore(user);

  if (typeof showToast === "function") {
    showToast(`Log masuk Google berjaya! Selamat datang, ${user.name}.`);
  }
}

// Kendalikan token rasmi daripada Google
function handleGoogleCredentialResponse(response) {
  if (!response || !response.credential) {
    alert("Gagal menerima maklumat akaun Google.");
    return;
  }

  const payload = decodeJwt(response.credential);
  if (!payload || !payload.email) {
    alert("Pengesahan token Google gagal.");
    return;
  }

  const user = {
    name: payload.name || payload.email.split("@")[0],
    email: payload.email,
    provider: "google",
    picture: payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || 'User')}&background=01875f&color=fff&bold=true`,
    registeredAt: new Date().toISOString()
  };

  localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(user));
  saveToRegisteredList(user);
  unlockStore(user);

  if (typeof showToast === "function") {
    showToast(`Log masuk Google berjaya! Selamat datang, ${user.name}.`);
  }
}

// Kendalikan borang pendaftaran manual
function handleRegisterSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById("regUserName");
  const emailInput = document.getElementById("regUserEmail");
  const submitBtn = document.getElementById("regSubmitBtn");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();

  if (!name || name.length < 2) {
    alert("Sila masukkan nama anda.");
    nameInput.focus();
    return;
  }

  if (!email || !email.includes("@") || !email.includes(".")) {
    alert("Sila masukkan alamat email yang sah.");
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
      email: email,
      provider: "manual",
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=01875f&color=fff&bold=true`,
      registeredAt: new Date().toISOString()
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
  }, 400);
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
      userAvatar.src = user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=01875f&color=fff&bold=true`;
    }
    if (userName) {
      userName.textContent = user.name;
    }
  }
}

// Simpan senarai pengguna yang pernah mendaftar
function saveToRegisteredList(user) {
  try {
    let list = JSON.parse(localStorage.getItem(AUTH_CONFIG.registeredListKey) || "[]");
    list = list.filter(item => item.email !== user.email);
    list.unshift(user);
    localStorage.setItem(AUTH_CONFIG.registeredListKey, JSON.stringify(list));
  } catch (e) {
    console.warn("Gagal simpan rekod pendaftar:", e);
  }
}

// Log Keluar Pengguna
function logoutUser() {
  if (confirm("Adakah anda pasti mahu log keluar daripada PlayStore Hub?")) {
    localStorage.removeItem(AUTH_CONFIG.storageKey);
    
    if (typeof showToast === "function") {
      showToast("Anda telah berjaya log keluar.");
    }
    
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }
}

// Pembaca token JWT Google
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
    console.error("Gagal membaca token Google:", e);
    return null;
  }
}
