// ============================================================================
// SUPABASE CLIENT & HELPERS - ATOK LURE APPS STORE
// ============================================================================

let _supabaseClient = null;

function getSupabaseClient() {
  if (_supabaseClient) return _supabaseClient;
  if (
    typeof window.supabase !== "undefined" &&
    typeof STORE_CONFIG !== "undefined" &&
    STORE_CONFIG.supabaseUrl &&
    STORE_CONFIG.supabaseKey
  ) {
    _supabaseClient = window.supabase.createClient(
      STORE_CONFIG.supabaseUrl,
      STORE_CONFIG.supabaseKey
    );
  }
  return _supabaseClient;
}

// Tukar baris jadual Supabase (snake_case) kepada format objek UI Store (camelCase)
function mapDbAppToStoreApp(row) {
  return {
    id: row.id,
    sortOrder: row.sort_order ?? 0,
    name: row.name,
    isOpen: row.is_open !== false,
    subtitle: row.subtitle || "",
    developer: row.developer || "",
    category: row.category || "utiliti",
    categoryName: row.category_name || row.category || "Utiliti",
    version: row.version || "v1.0.0",
    fileSize: row.file_size || "0 MB",
    rating: Number(row.rating) || 4.8,
    reviews: row.reviews || "0",
    downloads: row.downloads || "0",
    ageRating: row.age_rating || "3+",
    icon: row.icon || "",
    apkFile: row.apk_file || "",
    badge: row.badge || "",
    featured: Boolean(row.featured),
    bannerColor: row.banner_color || "linear-gradient(135deg, #01875f 0%, #055b41 100%)",
    description: row.description || "",
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    features: Array.isArray(row.features) ? row.features : [],
    whatsNew: row.whats_new || "",
    minAndroid: row.min_android || "Android 6.0+",
    packageName: row.package_name || ""
  };
}

// Muat turun senarai aplikasi terkini dari Supabase
async function fetchAppsFromSupabase() {
  const sb = getSupabaseClient();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from("apps")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("Supabase fetchApps warning:", error.message);
      return null;
    }
    if (!data || data.length === 0) return null;

    return data.map(mapDbAppToStoreApp);
  } catch (err) {
    console.warn("Supabase fetchApps error:", err);
    return null;
  }
}

// Rekod log masuk & muat turun ke jadual activity_logs di Supabase
async function logActivityToSupabase(data) {
  const sb = getSupabaseClient();
  if (!sb) return;

  try {
    await sb.from("activity_logs").insert([{
      event_type: data.type || "event",
      app_id: data.appId || null,
      app_name: data.appName || null,
      app_version: data.appVersion || null,
      file_size: data.fileSize || null,
      user_name: data.userName || "Tetamu",
      user_email: data.userEmail || "Tidak diketahui",
      provider: data.provider || null
    }]);
  } catch (err) {
    // Abaikan ralat senyap supaya muat turun pengguna tidak terganggu
  }
}
