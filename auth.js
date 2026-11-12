// Google Single Sign-On (GIS) Authentication Module for PlayStore APK Hub

const AUTH_CONFIG = {
  // Masukkan Google OAuth Client ID anda dari Google Cloud Console di sini:
  // Contoh: "1234567890-abcdefg.apps.googleusercontent.com"
  googleClientId: "", 
  
  // Kunci simpanan session di browser
  storageKey: "playstore_user_session"
};

// Semak status log masuk bila laman dibuka
document.addEventListener("DOMContentLoaded", () => {
  initAuth();
});

// Mulakan sistem Auth
function initAuth() {
  const currentUser = getLoggedInUser();

  if (currentUser) {
    // Pengguna sudah log masuk
    unlockStore(currentUser);
  } else {
    // Pengguna belum log masuk - kunci store
    lockStore();
    setupGoogleSignInButton();
  }
}

// Dapatkan maklumat pengguna yang disimpan
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
    if (userAvatar && user.picture) userAvatar.src = user.picture;
    if (userName) userName.textContent = user.name || user.email.split("@")[0];
  }
}

// Sediakan Butang Sign-In Google
function setupGoogleSignInButton() {
  const clientId = AUTH_CONFIG.googleClientId || (typeof STORE_CONFIG !== "undefined" ? STORE_CONFIG.googleClientId : "");
  const googleBtnContainer = document.getElementById("googleBtnContainer");
  const demoBtn = document.getElementById("demoSignInBtn");

  if (clientId && clientId.trim() !== "") {
    // Guna Google Identity Services yang rasmi
    if (window.google && google.accounts && google.accounts.id) {
      google.accounts.id.initialize({
        client_id: clientId.trim(),
        callback: handleGoogleCredentialResponse,
        auto_select: false
      });

      googleBtnContainer.innerHTML = "";
      google.accounts.id.renderButton(googleBtnContainer, {
        theme: document.documentElement.getAttribute("data-theme") === "dark" ? "filled_black" : "outline",
        size: "large",
        shape: "pill",
        text: "signin_with",
        width: 280,
        logo_alignment: "left"
      });
    } else {
      // Tunggu SDK Google dimuatkan
      setTimeout(setupGoogleSignInButton, 300);
    }
  } else {
    // Jika Client ID belum dimasukkan, tunjukkan butang panduan & demo
    if (demoBtn) demoBtn.style.display = "flex";
  }
}

// Kendalikan respon token selepas pengguna log masuk dengan Google
function handleGoogleCredentialResponse(response) {
  if (!response || !response.credential) {
    showToast("Gagal menerima maklumat akaun Google.");
    return;
  }

  const payload = decodeJwt(response.credential);
  if (!payload || !payload.email) {
    showToast("Pengesahan Google gagal.");
    return;
  }

  const user = {
    sub: payload.sub,
    email: payload.email,
    name: payload.name || payload.email.split("@")[0],
    picture: payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || 'User')}&background=01875f&color=fff`,
    loginAt: new Date().toISOString()
  };

  // Simpan dalam localStorage
  localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(user));

  unlockStore(user);
  showToast(`Selamat datang, ${user.name}! Akses penuh dibuka.`);
}

// Log Keluar Pengguna
function logoutUser() {
  if (confirm("Adakah anda pasti mahu log keluar?")) {
    localStorage.removeItem(AUTH_CONFIG.storageKey);
    showToast("Anda telah berjaya log keluar.");
    
    // Muat semula halaman untuk mengunci kembali
    setTimeout(() => {
      window.location.reload();
    }, 400);
  }
}

// Log Masuk Demo / Ujian Sementara (sebelum user setup Google Client ID rasmi)
function triggerDemoLogin() {
  const emailInput = prompt("Masukkan email Gmail anda untuk mendaftar masuk (Ujian):", "user@gmail.com");
  if (!emailInput || !emailInput.includes("@")) {
    if (emailInput !== null) alert("Sila masukkan format email yang sah.");
    return;
  }

  const namePart = emailInput.split("@")[0];
  const user = {
    sub: "demo_" + Date.now(),
    email: emailInput,
    name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
    picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(namePart)}&background=01875f&color=fff`,
    loginAt: new Date().toISOString()
  };

  localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(user));
  unlockStore(user);
  showToast(`Selamat datang, ${user.name}!`);
}

// Buka Panduan Cara Dapatkan Google Client ID
function openGoogleClientIdGuide() {
  alert(
    "Langkah Mudah Dapatkan Google Client ID Percuma (2 Minit):\n\n" +
    "1. Buka https://console.cloud.google.com/apis/credentials\n" +
    "2. Cipta projek baru (cth: 'PlayStore APK Hub')\n" +
    "3. Di menu Credentials -> Klik '+ CREATE CREDENTIALS' -> Pilih 'OAuth client ID'\n" +
    "4. Application type: Pilih 'Web application'\n" +
    "5. Authorized JavaScript origins: Masukkan link GitHub anda:\n" +
    "   https://fishingcorp2020.github.io\n" +
    "6. Salin Client ID yang diberikan dan tampal ke dalam fail 'auth.js' di baris googleClientId!"
  );
}

// Pembaca token JWT Google tanpa library luar
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
