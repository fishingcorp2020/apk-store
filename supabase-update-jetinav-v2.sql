-- ============================================================================
-- KEMAS KINI JETINAV PRO v2.0 (GUI TERKINI) KE JADUAL APPS SUPABASE
-- Jalankan dalam Supabase Dashboard -> SQL Editor jika mahu kemas kini terus,
-- ATAU klik butang "Segerak Kemas Kini" dalam Panel Admin (admin.html).
-- ============================================================================

INSERT INTO public.apps (
  id, sort_order, name, is_open, subtitle, developer, category, category_name,
  version, file_size, rating, reviews, downloads, age_rating, icon, apk_file,
  badge, featured, banner_color, description, highlights, features, whats_new,
  min_android, package_name
) VALUES (
  'jetinav',
  2,
  'JetiNav Pro (All-Terrain)',
  true,
  'GPS Navigasi Luar Talian Pintar (Laut, Sungai & Darat)',
  'Atoklure Marine & Outdoor',
  'navigasi',
  'Navigasi & GPS',
  'v2.0 Pro',
  '7.5 MB',
  4.9,
  '2.8k',
  '12,000+',
  '3+',
  'assets/icons/jetinav.png',
  'apks/JetiNav_v2.0_AllTerrain.apk',
  'GUI Terkini',
  true,
  'linear-gradient(135deg, #030b17 0%, #0c4a6e 55%, #008779 100%)',
  'JetiNav Pro v2.0 dibina khusus untuk pelayar bot laut, sungai/tasik, serta pengembara hutan belantara dengan GUI premium 100% tanpa internet. Memisahkan paparan info secara pintar mengikut persekitaran — unit Knot & Batu Nautika untuk Laut, jejak alur untuk Sungai/Tasik, serta Ketinggian (Altitud) & jejak denai untuk Darat/Hutan.',
  '["GUI Premium Terkini 100% Luar Talian (Zero Internet)","Pemisahan Info Pintar: Mod Laut (Knot/NM), Mod Sungai & Mod Darat (Altitud)","Bar Penjajaran Haluan Visual + Suara Panduan Belokan & Salah Laluan","Mod Malam Merah AMOLED (Red-Vision) & Kompas Gyro 360°"]'::jsonb,
  '["🌊 Mod Laut Khusus Marin: Paparan Knot (SOG), Batu Nautika (NM), Arah Bearing, radar laut dalam dan tag pantas Jeti, Pengkalan, Lubuk & Pulau.","🌲 Mod Darat & Hutan: Paparan Ketinggian (Altitud m), kelajuan jalan (km/j), kontur topografi dan tag pantas Parking Kereta, Khemah, Punca Air & Pos Renjer.","🔊 Suara Belokan & Amaran Salah Laluan: Panduan suara Bahasa Melayu pada jarak 1 km, 500 m, 200 m, 100 m, 50 m serta amaran automatik jika bot/langkah terpesong > 45°.","🧭 3 Butang Taktikal Mudah Guna: Set Lokasi, Cari Balik & Reset, dilengkapi kompas fallback magnetik dan skrin sentiasa hidup (Always Awake)."]'::jsonb,
  'Versi 2.0 Pro (GUI Terkini): Rekaan antaramuka premium baharu 100% luar talian, pemisahan info pintar mengikut Mod Laut/Sungai/Darat, Bar Penjajaran Haluan visual, suara panduan belokan & amaran salah laluan, serta sokongan kompas fallback magnetik.',
  'Android 6.0 (Marshmallow)+',
  'com.atoklure.jetinav'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
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
