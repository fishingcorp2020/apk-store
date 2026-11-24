-- ============================================================================
-- TAMBAH FISHLOG PRO v1.1.0 KE JADUAL APPS SUPABASE
-- Jalankan dalam Supabase Dashboard -> SQL Editor jika mahu tambah terus,
-- ATAU gunakan butang "Segerak App Baharu" di Panel Admin store.
-- ============================================================================

INSERT INTO public.apps (
  id, sort_order, name, is_open, subtitle, developer, category, category_name,
  version, file_size, rating, reviews, downloads, age_rating, icon, apk_file,
  badge, featured, banner_color, description, highlights, features, whats_new,
  min_android, package_name
) VALUES (
  'fishlogpro',
  12,
  'FishLog Pro',
  true,
  'Log Tangkapan Ikan Harian Luar Talian — Powered by Atoklure',
  'Atoklure Studio',
  'utiliti',
  'Utiliti & Memancing',
  'v1.1.0',
  '21.8 MB',
  5.0,
  'Baharu',
  '100+',
  '3+',
  'assets/icons/fishlogpro.svg',
  'apks/FishLogPro_v1.1.apk',
  'Terkini',
  true,
  'linear-gradient(135deg, #132A24 0%, #556B2F 100%)',
  'FishLog Pro ialah aplikasi log tangkapan ikan harian berbahasa Melayu untuk kaki pancing Malaysia yang berfungsi 100% tanpa internet. Direka khas mengikut gaya hutan gelap & emas dengan skrin Splash Intro, Dashboard bento, tarikh memancing pilihan pengguna, bilangan ekor dan berat paling besar (pilihan — tidak wajib diisi) berserta laporan Harian, Bulanan, Tahunan dan Rekod Peribadi (PB).',
  '["Skrin Splash Intro & GUI Hutan Gelap + Emas Premium","Berat Ikan & Lokasi adalah Pilihan (Tidak Wajib Diisi)","Pemilih Tarikh Bebas (Date Picker) Termasuk Rekod Lampau","Laporan Harian, Bulanan, Tahunan & Tab Rekod Peribadi (PB)"]'::jsonb,
  '["🎣 Log Harian Pantas & Fleksibel: Rekod tarikh pilihan, spesies dan bilangan ekor serta-merta; berat, lokasi, gambar dan nota semuanya pilihan.","🐟 18 Spesies Asas Malaysia + Senarai Ikan & Spesies Tersuai: Haruan, Toman, Sebarau, Peacock Bass (PB), Baung, Siakap dan carian pantas.","📊 Statistik & Trend Tahunan: Graf palang harian, carta donat pecahan spesies, graf garis Trend Prestasi Tahunan dan tab khusus Rekod PB.","💾 Sandaran & Eksport Tempatan: Eksport laporan CSV dan sandaran penuh JSON beserta import semula anti-pendua tanpa akses internet."]'::jsonb,
  'Versi 1.1.0: Skrin Splash Intro baharu dengan butang Mulakan Sekarang, susun atur GUI gaya template Atoklure (Dashboard bento 2x2, Senarai Ikan, tab khusus PB & graf trend tahunan), tema lalai hutan gelap + emas, serta menjadikan berat ikan sebagai medan pilihan sepenuhnya.',
  'Android 8.0 (Oreo)+',
  'com.fishlogpro.app'
)
ON CONFLICT (id) DO UPDATE SET
  sort_order = EXCLUDED.sort_order,
  name = EXCLUDED.name,
  is_open = EXCLUDED.is_open,
  subtitle = EXCLUDED.subtitle,
  developer = EXCLUDED.developer,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  version = EXCLUDED.version,
  file_size = EXCLUDED.file_size,
  icon = EXCLUDED.icon,
  apk_file = EXCLUDED.apk_file,
  badge = EXCLUDED.badge,
  featured = EXCLUDED.featured,
  banner_color = EXCLUDED.banner_color,
  description = EXCLUDED.description,
  highlights = EXCLUDED.highlights,
  features = EXCLUDED.features,
  whats_new = EXCLUDED.whats_new,
  min_android = EXCLUDED.min_android,
  package_name = EXCLUDED.package_name,
  updated_at = now();
