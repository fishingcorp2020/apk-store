// ============================================================================
// PANEL ADMIN LOGIC - ATOK LURE APPS STORE (SUPABASE)
// ============================================================================

let adminApps = [];

document.addEventListener("DOMContentLoaded", async () => {
  const sb = getSupabaseClient();
  if (!sb) {
    alert("Konfigurasi Supabase tidak dijumpai dalam apps-data.js.");
    return;
  }

  // Semak sesi login Admin sedia ada
  const { data: { session } } = await sb.auth.getSession();
  if (session && session.user) {
    showDashboard(session.user);
  } else {
    showLogin();
  }

  // Pengendali borang login
  const loginForm = document.getElementById("adminLoginForm");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const errBox = document.getElementById("loginError");
    const loginBtn = document.getElementById("loginBtn");

    errBox.style.display = "none";
    loginBtn.disabled = true;
    loginBtn.textContent = "Sedang mengesahkan...";

    const { data, error } = await sb.auth.signInWithPassword({ email, password });

    loginBtn.disabled = false;
    loginBtn.textContent = "Log Masuk Admin";

    if (error) {
      errBox.textContent = "Gagal log masuk: " + error.message;
      errBox.style.display = "block";
      return;
    }

    if (data && data.user) {
      showDashboard(data.user);
    }
  });

  // Pengendali borang tambah/edit app
  document.getElementById("appForm").addEventListener("submit", handleSaveApp);
});

function showLogin() {
  document.getElementById("loginView").style.display = "flex";
  document.getElementById("dashboardView").style.display = "none";
}

function showDashboard(user) {
  document.getElementById("loginView").style.display = "none";
  document.getElementById("dashboardView").style.display = "block";
  document.getElementById("adminUserEmail").textContent = user.email || "Admin";
  loadAdminApps();
  loadActivityLogs();
}

async function adminLogout() {
  const sb = getSupabaseClient();
  if (sb) await sb.auth.signOut();
  showLogin();
}

function switchTab(tab) {
  const appsTab = document.getElementById("tabApps");
  const logsTab = document.getElementById("tabLogs");
  const appsBtn = document.getElementById("tabAppsBtn");
  const logsBtn = document.getElementById("tabLogsBtn");

  if (tab === "apps") {
    appsTab.style.display = "block";
    logsTab.style.display = "none";
    appsBtn.classList.add("active");
    logsBtn.classList.remove("active");
  } else {
    appsTab.style.display = "none";
    logsTab.style.display = "block";
    appsBtn.classList.remove("active");
    logsBtn.classList.add("active");
    loadActivityLogs();
  }
}

async function loadAdminApps() {
  const sb = getSupabaseClient();
  const listEl = document.getElementById("adminAppsList");
  listEl.innerHTML = `<div style="color:var(--muted); padding:20px;">Memuatkan senarai aplikasi dari Supabase...</div>`;

  const { data, error } = await sb
    .from("apps")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    listEl.innerHTML = `<div style="color:#f87171; padding:20px;">Ralat memuatkan data: ${error.message}. Pastikan anda telah jalankan kod SQL setup di Supabase.</div>`;
    return;
  }

  adminApps = data || [];
  renderAdminApps();
}

function renderAdminApps() {
  const listEl = document.getElementById("adminAppsList");
  const openCount = adminApps.filter(a => a.is_open !== false).length;
  const closedCount = adminApps.length - openCount;

  document.getElementById("statTotal").textContent = adminApps.length;
  document.getElementById("statOpen").textContent = openCount;
  document.getElementById("statClosed").textContent = closedCount;
  updateSyncCatalogButton();

  if (adminApps.length === 0) {
    listEl.innerHTML = `<div style="color:var(--muted); padding:20px;">Tiada aplikasi dalam database lagi. Klik "+ Tambah App Baru" untuk mula.</div>`;
    return;
  }

  const { outdated } = getCatalogSyncDiff();
  const outdatedMap = new Map(outdated.map(item => [item.app.id, item.app]));

  listEl.innerHTML = adminApps.map(app => {
    const isOpen = app.is_open !== false;
    const localUpdate = outdatedMap.get(app.id);
    const updateBadge = localUpdate
      ? `<span style="font-size:0.7rem; background:rgba(56,189,248,0.18); color:#38bdf8; border:1px solid rgba(56,189,248,0.4); padding:2px 7px; border-radius:999px; margin-left:6px;">✨ Kemas kini ${localUpdate.version} tersedia</span>`
      : "";
    return `
      <div class="admin-app-row ${isOpen ? '' : 'is-closed'}" id="row-${app.id}">
        <div class="app-left">
          <img src="${app.icon || 'assets/icons/tvkita.png'}" alt="${app.name}" onerror="this.style.opacity=0.3">
          <div>
            <div class="app-name">${app.name} <span style="font-size:0.75rem; color:var(--muted); font-weight:400;">(${app.version})</span>${updateBadge}</div>
            <div class="app-meta">${app.category_name || app.category} &bull; ${app.file_size} &bull; ID: <code>${app.id}</code></div>
          </div>
        </div>
        <div class="app-controls">
          <label class="switch-wrap" title="Klik untuk Buka / Tutup Muat Turun">
            <span class="switch">
              <input type="checkbox" ${isOpen ? 'checked' : ''} onchange="toggleAppStatus('${app.id}', this)">
              <span class="slider"></span>
            </span>
            <span class="status-pill ${isOpen ? 'open' : 'closed'}" id="pill-${app.id}">
              ${isOpen ? '● AKTIF' : '🔧 NAIK TARAF'}
            </span>
          </label>
          <button class="btn btn-secondary btn-sm" onclick="openAppFormModal('${app.id}')">✏️ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteApp('${app.id}', '${app.name.replace(/'/g, "\\'")}')">🗑️</button>
        </div>
      </div>
    `;
  }).join("");
}

async function toggleAppStatus(appId, checkboxEl) {
  const sb = getSupabaseClient();
  const newStatus = checkboxEl.checked;
  const pill = document.getElementById(`pill-${appId}`);
  const row = document.getElementById(`row-${appId}`);

  // Kemas kini UI serta-merta
  if (pill) {
    pill.className = `status-pill ${newStatus ? 'open' : 'closed'}`;
    pill.textContent = newStatus ? '● AKTIF' : '🔧 NAIK TARAF';
  }
  if (row) {
    row.classList.toggle("is-closed", !newStatus);
  }

  const { error } = await sb
    .from("apps")
    .update({ is_open: newStatus, updated_at: new Date().toISOString() })
    .eq("id", appId);

  if (error) {
    checkboxEl.checked = !newStatus;
    showAdminToast("Ralat kemas kini: " + error.message);
    renderAdminApps();
    return;
  }

  const appObj = adminApps.find(a => a.id === appId);
  if (appObj) appObj.is_open = newStatus;

  const openCount = adminApps.filter(a => a.is_open !== false).length;
  document.getElementById("statOpen").textContent = openCount;
  document.getElementById("statClosed").textContent = adminApps.length - openCount;

  showAdminToast(`Status ${appObj ? appObj.name : appId} ditukar kepada ${newStatus ? 'AKTIF' : 'NAIK TARAF'}.`);
}

function openAppFormModal(appId = null) {
  const modal = document.getElementById("appFormModal");
  const title = document.getElementById("formModalTitle");
  const editMode = document.getElementById("editMode");
  const idInput = document.getElementById("fId");

  document.getElementById("appForm").reset();

  if (appId) {
    const app = adminApps.find(a => a.id === appId);
    if (!app) return;

    editMode.value = "edit";
    title.textContent = `Edit Aplikasi: ${app.name}`;
    idInput.value = app.id;
    idInput.readOnly = true;

    document.getElementById("fName").value = app.name || "";
    document.getElementById("fSubtitle").value = app.subtitle || "";
    document.getElementById("fDeveloper").value = app.developer || "";
    document.getElementById("fCategory").value = app.category || "utiliti";
    document.getElementById("fCategoryName").value = app.category_name || "";
    document.getElementById("fVersion").value = app.version || "v1.0.0";
    document.getElementById("fFileSize").value = app.file_size || "";
    document.getElementById("fBadge").value = app.badge || "";
    document.getElementById("fSortOrder").value = app.sort_order ?? 9;
    document.getElementById("fIcon").value = app.icon || "";
    document.getElementById("fApkFile").value = app.apk_file || "";
    document.getElementById("fDescription").value = app.description || "";
    document.getElementById("fHighlights").value = Array.isArray(app.highlights) ? app.highlights.join("\n") : "";
    document.getElementById("fFeatures").value = Array.isArray(app.features) ? app.features.join("\n") : "";
    document.getElementById("fWhatsNew").value = app.whats_new || "";
    document.getElementById("fMinAndroid").value = app.min_android || "Android 6.0+";
    document.getElementById("fPackageName").value = app.package_name || "";
    document.getElementById("fIsOpen").checked = app.is_open !== false;
    document.getElementById("fFeatured").checked = Boolean(app.featured);
  } else {
    editMode.value = "create";
    title.textContent = "Tambah Aplikasi Baru";
    idInput.readOnly = false;
    document.getElementById("fSortOrder").value = adminApps.length + 1;
    document.getElementById("fIsOpen").checked = true;
  }

  modal.classList.add("active");
}

function closeAppFormModal() {
  document.getElementById("appFormModal").classList.remove("active");
}

async function handleSaveApp(e) {
  e.preventDefault();
  const sb = getSupabaseClient();
  const saveBtn = document.getElementById("saveAppBtn");
  const mode = document.getElementById("editMode").value;

  const rawId = document.getElementById("fId").value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  if (!rawId) {
    alert("Sila masukkan ID unik yang sah (huruf kecil / nombor sahaja).");
    return;
  }

  const payload = {
    id: rawId,
    name: document.getElementById("fName").value.trim(),
    subtitle: document.getElementById("fSubtitle").value.trim(),
    developer: document.getElementById("fDeveloper").value.trim(),
    category: document.getElementById("fCategory").value,
    category_name: document.getElementById("fCategoryName").value.trim(),
    version: document.getElementById("fVersion").value.trim(),
    file_size: document.getElementById("fFileSize").value.trim(),
    badge: document.getElementById("fBadge").value.trim(),
    sort_order: parseInt(document.getElementById("fSortOrder").value, 10) || 9,
    icon: document.getElementById("fIcon").value.trim(),
    apk_file: document.getElementById("fApkFile").value.trim(),
    description: document.getElementById("fDescription").value.trim(),
    highlights: document.getElementById("fHighlights").value.split("\n").map(s => s.trim()).filter(Boolean),
    features: document.getElementById("fFeatures").value.split("\n").map(s => s.trim()).filter(Boolean),
    whats_new: document.getElementById("fWhatsNew").value.trim(),
    min_android: document.getElementById("fMinAndroid").value.trim(),
    package_name: document.getElementById("fPackageName").value.trim(),
    is_open: document.getElementById("fIsOpen").checked,
    featured: document.getElementById("fFeatured").checked,
    updated_at: new Date().toISOString()
  };

  saveBtn.disabled = true;
  saveBtn.textContent = "Sedang menyimpan...";

  let result;
  if (mode === "edit") {
    result = await sb.from("apps").update(payload).eq("id", rawId);
  } else {
    result = await sb.from("apps").insert([payload]);
  }

  saveBtn.disabled = false;
  saveBtn.textContent = "💾 Simpan ke Database";

  if (result.error) {
    alert("Ralat menyimpan: " + result.error.message);
    return;
  }

  closeAppFormModal();
  showAdminToast(`Aplikasi "${payload.name}" berjaya disimpan!`);
  loadAdminApps();
}

async function deleteApp(appId, appName) {
  if (!confirm(`Adakah anda pasti mahu memadam aplikasi "${appName}" daripada database?`)) return;

  const sb = getSupabaseClient();
  const { error } = await sb.from("apps").delete().eq("id", appId);

  if (error) {
    alert("Ralat memadam: " + error.message);
    return;
  }

  showAdminToast(`Aplikasi "${appName}" telah dipadam.`);
  loadAdminApps();
}

async function handleFileUpload(inputEl, folder, targetInputId, sizeInputId = null) {
  const file = inputEl.files && inputEl.files[0];
  if (!file) return;

  const sb = getSupabaseClient();
  const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const filePath = `${folder}/${cleanName}`;

  showAdminToast(`Sedang memuat naik ${file.name}...`);

  const { error } = await sb.storage.from("store-files").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false
  });

  if (error) {
    alert("Gagal muat naik fail: " + error.message);
    return;
  }

  const { data: pub } = sb.storage.from("store-files").getPublicUrl(filePath);
  if (pub && pub.publicUrl) {
    document.getElementById(targetInputId).value = pub.publicUrl;
  }

  if (sizeInputId) {
    const mb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    document.getElementById(sizeInputId).value = mb;
  }

  showAdminToast(`Fail ${file.name} berjaya dimuat naik!`);
}

async function loadActivityLogs() {
  const sb = getSupabaseClient();
  const tbody = document.getElementById("logsTableBody");

  const { data, error } = await sb
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:#f87171;">Ralat memuatkan log: ${error.message}</td></tr>`;
    return;
  }

  document.getElementById("statLogs").textContent = (data || []).length;

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:var(--muted);">Belum ada rekod aktiviti lagi.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(row => {
    const dateStr = new Date(row.created_at).toLocaleString("ms-MY", { timeZone: "Asia/Kuala_Lumpur" });
    const isDownload = row.event_type === "download";
    return `
      <tr>
        <td style="white-space:nowrap;">${dateStr}</td>
        <td><span class="badge-type ${isDownload ? 'badge-download' : 'badge-login'}">${isDownload ? '⬇️ Muat Turun' : '🔑 Log Masuk'}</span></td>
        <td>${row.app_name || '-'}</td>
        <td>${row.user_name || '-'}</td>
        <td style="color:var(--muted);">${row.user_email || '-'}</td>
      </tr>
    `;
  }).join("");
}

function showAdminToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(window._adminToastTimer);
  window._adminToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function getCatalogSyncDiff() {
  if (typeof APPS_DATA === "undefined" || !Array.isArray(APPS_DATA)) {
    return { missing: [], outdated: [] };
  }
  const existingMap = new Map((adminApps || []).map(a => [a.id, a]));
  const missing = [];
  const outdated = [];

  APPS_DATA.forEach((app, index) => {
    if (!app || !app.id) return;
    const remote = existingMap.get(app.id);
    if (!remote) {
      missing.push({ app, sortOrder: app.sortOrder ?? (index + 1) });
      return;
    }

    const checks = [
      [app.name || "", remote.name || ""],
      [app.subtitle || "", remote.subtitle || ""],
      [app.version || "", remote.version || ""],
      [app.fileSize || "", remote.file_size || ""],
      [app.apkFile || "", remote.apk_file || ""],
      [app.badge || "", remote.badge || ""],
      [app.whatsNew || "", remote.whats_new || ""],
      [app.description || "", remote.description || ""],
      [app.bannerColor || "", remote.banner_color || ""],
      [app.minAndroid || "", remote.min_android || ""]
    ];
    const hasDiff = checks.some(([localVal, remoteVal]) => String(localVal).trim() !== String(remoteVal).trim());
    if (hasDiff) {
      outdated.push({ app, remote });
    }
  });

  return { missing, outdated };
}

function updateSyncCatalogButton() {
  const btn = document.getElementById("syncCatalogBtn");
  if (!btn) return;
  const { missing, outdated } = getCatalogSyncDiff();
  if (missing.length > 0 || outdated.length > 0) {
    btn.style.display = "inline-flex";
    if (missing.length > 0 && outdated.length > 0) {
      btn.textContent = `🔄 Segerak Katalog (${missing.length} baharu, ${outdated.length} kemas kini)`;
    } else if (missing.length > 0) {
      btn.textContent = `🔄 Segerak App Baharu (${missing.length})`;
    } else {
      btn.textContent = `🔄 Segerak Kemas Kini (${outdated.length})`;
    }
  } else {
    btn.style.display = "none";
  }
}

function buildCatalogPayload(app, nowIso) {
  return {
    name: app.name,
    subtitle: app.subtitle || "",
    developer: app.developer || "",
    category: app.category || "utiliti",
    category_name: app.categoryName || app.category || "Utiliti",
    version: app.version || "v1.0.0",
    file_size: app.fileSize || "0 MB",
    rating: Number(app.rating) || 4.8,
    reviews: app.reviews || "0",
    downloads: app.downloads || "0",
    age_rating: app.ageRating || "3+",
    icon: app.icon || "",
    apk_file: app.apkFile || "",
    badge: app.badge || "",
    featured: Boolean(app.featured),
    banner_color: app.bannerColor || "linear-gradient(135deg, #01875f 0%, #055b41 100%)",
    description: app.description || "",
    highlights: Array.isArray(app.highlights) ? app.highlights : [],
    features: Array.isArray(app.features) ? app.features : [],
    whats_new: app.whatsNew || "",
    min_android: app.minAndroid || "Android 6.0+",
    package_name: app.packageName || "",
    updated_at: nowIso
  };
}

async function syncMissingAppsFromCatalog() {
  const sb = getSupabaseClient();
  const btn = document.getElementById("syncCatalogBtn");
  const { missing, outdated } = getCatalogSyncDiff();

  if (missing.length === 0 && outdated.length === 0) {
    showAdminToast("Semua aplikasi dan versi terkini dalam apps-data.js sudah segerak dengan Supabase.");
    return;
  }

  const nowIso = new Date().toISOString();
  const maxSort = (adminApps || []).reduce((max, a) => Math.max(max, Number(a.sort_order) || 0), 0);

  if (btn) {
    btn.disabled = true;
    btn.textContent = "Sedang menyegerak...";
  }

  if (missing.length > 0) {
    const rows = missing.map(({ app }, idx) => ({
      id: app.id,
      sort_order: maxSort + 1 + idx,
      is_open: app.isOpen !== false,
      ...buildCatalogPayload(app, nowIso)
    }));

    const { error } = await sb.from("apps").insert(rows);
    if (error) {
      if (btn) btn.disabled = false;
      alert("Ralat menyegerak aplikasi baharu: " + error.message);
      updateSyncCatalogButton();
      return;
    }
  }

  for (const { app } of outdated) {
    const updatePayload = buildCatalogPayload(app, nowIso);
    const { error } = await sb.from("apps").update(updatePayload).eq("id", app.id);
    if (error) {
      if (btn) btn.disabled = false;
      alert(`Ralat mengemas kini "${app.name}": ${error.message}`);
      updateSyncCatalogButton();
      return;
    }
  }

  if (btn) {
    btn.disabled = false;
  }

  const syncedNames = [...missing, ...outdated].map(m => m.app.name).join(", ");
  showAdminToast(`Berjaya segerak ${missing.length} baharu & ${outdated.length} kemas kini ke store: ${syncedNames}`);
  await loadAdminApps();
}
