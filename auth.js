// Sistem Pendaftaran & Log Masuk Pantas (Tanpa Perlu Google Cloud)
// PlayStore APK Hub

const AUTH_CONFIG = {
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
    // Pengguna belum daftar - kunci store dan tunjuk borang
    lockStore();
  }

  // Pasang listener pada borang pendaftaran
  const authForm = document.getElementById("authRegisterForm");
  if (authForm) {
    authForm.addEventListener("submit", handleRegisterSubmit);
  }
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

// Kendalikan penghantaran borang pendaftaran
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
    alert("Sila masukkan alamat email yang sah (contoh: nama@gmail.com).");
    emailInput.focus();
    return;
  }

  // Tunjukkan loading pada butang
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Mendaftarkan...</span>`;
  }

  setTimeout(() => {
    // Cipta objek pengguna
    const user = {
      name: name,
      email: email,
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=01875f&color=fff&bold=true`,
      registeredAt: new Date().toISOString()
    };

    // Simpan sesi aktif dalam localStorage
    localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(user));

    // Simpan juga dalam senarai rekod pendaftar tempatan
    saveToRegisteredList(user);

    // Buka kunci gedung APK
    unlockStore(user);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Daftar & Masuk</span>`;
    }

    if (typeof showToast === "function") {
      showToast(`Pendaftaran berjaya! Selamat datang, ${user.name}.`);
    } else {
      alert(`Selamat datang, ${user.name}!`);
    }
  }, 400);
}

// Simpan senarai pengguna yang pernah mendaftar
function saveToRegisteredList(user) {
  try {
    let list = JSON.parse(localStorage.getItem(AUTH_CONFIG.registeredListKey) || "[]");
    // Elak duplikasi email
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
