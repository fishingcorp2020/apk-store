// Data Aplikasi Rasmi - PlayStore APK Hub
// Pengguna boleh tambah, padam atau kemas kini aplikasi di sini dengan mudah.

const STORE_CONFIG = {
  storeName: "PlayStore APK Hub",
  storeTagline: "Pusat Muat Turun Aplikasi Android Bebas & Rasmi",
  githubUsername: "fishingcorp2020",
  repoName: "apk-store",
  author: "Azizul (FishingCorp / Atoklure)",
  year: 2026,
  githubPagesUrl: "https://fishingcorp2020.github.io/apk-store",
  githubRepoUrl: "https://github.com/fishingcorp2020/apk-store",
  // Masukkan Google OAuth Client ID anda di sini (cth: "xxxxxx.apps.googleusercontent.com"):
  googleClientId: ""
};

const APPS_DATA = [
  {
    id: "tvkita",
    name: "TV KITA Pro",
    subtitle: "Siaran Langsung TV Malaysia & Arkib Hiburan VOD",
    developer: "Atoklure TV",
    category: "hiburan",
    categoryName: "Hiburan & TV",
    version: "v1.2.0",
    fileSize: "2.8 MB",
    rating: 4.9,
    reviews: "5.8k",
    downloads: "30,000+",
    ageRating: "12+",
    icon: "assets/icons/tvkita.png",
    apkFile: "apks/TV_KITA_v1.2_Netflix_VOD.apk",
    badge: "Pilihan Ramai",
    featured: true,
    bannerColor: "linear-gradient(135deg, #e50914 0%, #831010 100%)",
    description: "Pusat hiburan televisyen percuma untuk rakyat Malaysia. Tonton semua saluran TV tempatan siaran langsung, rancangan berita, sukan, kartun kanak-kanak, serta koleksi filem dan drama On-Demand (VOD). Dioptimumkan khas agar sangat lancar di telefon pintar mahupun Android TV Box.",
    highlights: [
      "Semua Saluran TV Tempatan Lengkap & Percuma",
      "Koleksi Filem & VOD Terkini Dikemas Kini Sentiasa",
      "Mesra Kawalan Jauh Android TV Box (D-Pad Navigation)",
      "Kualiti HD Boleh Laras Mengikut Kelajuan Internet"
    ],
    features: [
      "📡 Saluran Langsung Tanpa Putus: Rangkaian penstriman stabil untuk menonton berita dan sukan secara langsung.",
      "🎬 Hab Wayang VOD: Tonton filem-filem popular bila-bila masa mengikut keselesaan anda.",
      "⚡ Saiz Kompak 2.8MB: Tidak membebankan memori peranti dan menjimatkan storan.",
      "🔒 Tanpa Perlu Daftar / Langganan: Buka aplikasi dan terus pilih saluran kegemaran anda."
    ],
    whatsNew: "Versi 1.2: Pembaikan saluran siaran langsung, penambahan kategori VOD Netflix-style, dan kawalan pemain video yang lebih lancar.",
    minAndroid: "Android 5.0 (Lollipop)+",
    packageName: "com.atoklure.tvkita"
  },
  {
    id: "jetinav",
    name: "JetiNav All-Terrain",
    subtitle: "GPS Navigasi Luar Talian (Laut, Sungai & Hutan)",
    developer: "Atoklure Marine & Outdoor",
    category: "navigasi",
    categoryName: "Navigasi & GPS",
    version: "v2.0.0",
    fileSize: "7.5 MB",
    rating: 4.9,
    reviews: "2.8k",
    downloads: "12,000+",
    ageRating: "3+",
    icon: "assets/icons/jetinav.png",
    apkFile: "apks/JetiNav_v2.0_AllTerrain.apk",
    badge: "Pilihan Nelayan",
    featured: true,
    bannerColor: "linear-gradient(135deg, #0c5752 0%, #008779 100%)",
    description: "JetiNav All-Terrain dibina khusus untuk para pemancing laut dalam, bot sungai, pemburu, dan pengembara hutan belantara. Berfungsi 100% tanpa sambungan internet atau menara telefon telco dengan memanfaatkan sensor cip GPS satelit terus dalam telefon bimbit.",
    highlights: [
      "100% Berfungsi Luar Talian (Zero Internet Required)",
      "Penandaan Titik Koordinat (Waypoint GPS) Lubuk Ikan",
      "Jejak Laluan Balik Automatik (Breadcrumb Track Log)",
      "Mod Red-Vision (Kamera/Skrin Merah Taktikal Malam)"
    ],
    features: [
      "⚓ Pengurusan Lubuk & Jeti: Simpan koordinat lokasi kegemaran bersama nota kedalaman dan hasil tangkapan.",
      "🧭 Kompas Bearing & Kelajuan Knot: Paparan kelajuan bot (knot / km/h), arah mata angin dan altitud sebenar.",
      "🔴 Mod Penglihatan Merah: Lindungi adaptasi mata dalam kegelapan laut tanpa menarik perhatian serangga.",
      "🗺️ Peta Topografi & Kontur Air: Peta luar talian cache untuk panduan perairan selamat."
    ],
    whatsNew: "Versi 2.0 All-Terrain: Enjin peta luar talian dinaik taraf, penjejakan laluan balik lebih jitu, dan mod penjimatan bateri ekstrem.",
    minAndroid: "Android 7.0 (Nougat)+",
    packageName: "com.atoklure.jetinav"
  },
  {
    id: "cakapgo",
    name: "CakapGo",
    subtitle: "Penterjemah Suara Dua Hala & Kamus Frasa Pintar",
    developer: "Atoklure Studio",
    category: "komunikasi",
    categoryName: "Komunikasi & Bahasa",
    version: "v1.0.0",
    fileSize: "77.7 MB",
    rating: 4.8,
    reviews: "1.4k",
    downloads: "5,000+",
    ageRating: "3+",
    icon: "assets/icons/cakapgo.png",
    apkFile: "apks/CakapGo_v1.0.apk",
    badge: "Terkini",
    featured: true,
    bannerColor: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    description: "CakapGo ialah aplikasi penterjemah suara dan teks pantas yang direka khas untuk memudahkan komunikasi dwibahasa antara Bahasa Melayu, Inggeris, Korea dan pelbagai dialek. Dilengkapi dengan enjin pengecaman suara responsif, Romanizer fonetik khas Korea, dan koleksi frasa harian pelancongan tanpa internet.",
    highlights: [
      "Terjemahan suara masa nyata (Real-time Speech-to-Speech)",
      "Romanizer sebutan Korea untuk mudah dibaca",
      "Kamus frasa kecemasan & melancong sedia ada",
      "Visualisasi gelombang audio interaktif"
    ],
    features: [
      "🎙️ Mod Perbualan Dua Hala: Bicara bergilir secara natural dengan paparan terjemahan skrin terbelah.",
      "🇰🇷 Kamus & Sebutan Hangul: Belajar bertutur perkataan Korea dengan sebutan rumi yang tepat.",
      "📚 Frasa Kategori Pintar: Kategori makan, arah jalan, kecemasan, beli-belah & hotel.",
      "🔊 Enjin Sebutan Suara: Dengar audio sebutan yang jelas pada bila-bila masa."
    ],
    whatsNew: "Pelancaran versi 1.0 rasmi dengan sokongan penuh bahasa Melayu-Korea dan rekaan UI Material 3.",
    minAndroid: "Android 8.0 (Oreo)+",
    packageName: "com.atoklure.cakapgo"
  },
  {
    id: "daebaktv",
    name: "Daebak TV (대박 TV)",
    subtitle: "Filem, K-Drama & Siaran Korea Percuma VIP",
    developer: "Atoklure VIP",
    category: "hiburan",
    categoryName: "Hiburan & Video",
    version: "v1.0.0",
    fileSize: "1.9 MB",
    rating: 4.9,
    reviews: "4.8k",
    downloads: "25,000+",
    ageRating: "12+",
    icon: "assets/icons/daebaktv.png",
    apkFile: "apks/DaebakTV_v1.0.apk",
    badge: "VIP Stream",
    featured: false,
    bannerColor: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    description: "Daebak TV membawakan arkib drama Korea (K-Drama), filem pecah panggung (K-Movie), video muzik K-Pop 4K dan rancangan varieti terus ke telefon pintar dan Android TV Box anda. Saiz fail yang amat kecil (kurang 2MB) membolehkan pemasangan kilat dan penstriman pantas tanpa sekat.",
    highlights: [
      "Saiz ultra-ringan 1.9MB sahaja",
      "Sokongan penuh Android TV Box & Remote Control",
      "K-Drama & K-Movie sarikata Bahasa Melayu & Inggeris",
      "Siaran konsert K-Pop kualiti 4K/Full HD"
    ],
    features: [
      "📺 Mod Android Box TV: Navigasi mesra D-Pad Remote untuk tontonan santai di ruang tamu.",
      "⚡ Penstriman Pantas & Jimat Data: Enjin kependaman rendah tanpa penimbalan berterusan.",
      "🍿 Arkib Kandungan Terkini: Episod baharu drama Korea dikemas kini setiap minggu.",
      "🌙 Tema Pawagam Gelap: Paparan OLED-friendly untuk mata yang selesa di waktu malam."
    ],
    whatsNew: "Versi 1.0 sedia untuk Android Phone dan Android Box TV.",
    minAndroid: "Android 5.0 (Lollipop)+",
    packageName: "com.atoklure.daebaktv"
  },
  {
    id: "stickerkilat",
    name: "StickerKilat",
    subtitle: "Pembuat Sticker WhatsApp (Auto Cut AI & Border)",
    developer: "Atoklure Studio",
    category: "utiliti",
    categoryName: "Fotografi & Seni",
    version: "v1.0.0",
    fileSize: "2.0 MB",
    rating: 4.9,
    reviews: "3.2k",
    downloads: "18,000+",
    ageRating: "3+",
    icon: "assets/icons/stickerkilat.png",
    apkFile: "apks/StickerKilat_v1.0.apk",
    badge: "Paling Laris",
    featured: false,
    bannerColor: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    description: "Hasilkan sticker WhatsApp dan Telegram unik dalam beberapa saat sahaja! Dilengkapi alatan Auto Cut AI untuk membuang latar belakang foto, garisan border putih khas die-cut sticker, cermin mata Thug Life, dan ribuan ayat meme santai dialek tempatan.",
    highlights: [
      "Auto Cut AI: Buang latar belakang 1-klik",
      "Border Putih Die-Cut tebal ala sticker rasmi",
      "Koleksi Teks Meme & Slang Tempatan Viral",
      "Eksport Segera ke Format Rasmi WhatsApp (512x512 WEBP)"
    ],
    features: [
      "✂️ Pilihan Potongan Lengkap: Tongkat sakti Magic Wand, bentuk hati/bintang/bulat, dan berus pemadam halus.",
      "🗣️ Teks Lawak Sedia Ada: 'PADU BEBAQ!', 'SEMBANG KENCANG', 'SABAR SAT LA', 'ON X ON?' dan banyak lagi.",
      "🕶️ Aksesori Kelakar: Cermin mata hitam 8-bit, topi parti, mahkota, misai tebal dan kopiah.",
      "📦 Pek Koleksi Sendiri: Kumpulkan sticker buatan sendiri dan tambah terus ke WhatsApp dalam satu pek."
    ],
    whatsNew: "Versi 1.0 dengan enjin pemangkas foto pantas dan integrasi pek WhatsApp.",
    minAndroid: "Android 5.0 (Lollipop)+",
    packageName: "com.atoklure.stickerkilat"
  },
  {
    id: "sembangoffline",
    name: "Sembang Offline",
    subtitle: "Walkie-Talkie Suara Tanpa Internet (Wi-Fi Direct P2P)",
    developer: "FishingCorp Labs",
    category: "komunikasi",
    categoryName: "Komunikasi & Suara",
    version: "v1.0.0",
    fileSize: "15.8 MB",
    rating: 4.8,
    reviews: "850",
    downloads: "3,500+",
    ageRating: "3+",
    icon: "assets/icons/sembangoffline.svg",
    apkFile: "apks/SembangOffline_v1.0.apk",
    badge: "Walkie-Talkie",
    featured: false,
    bannerColor: "linear-gradient(135deg, #10b981 0%, #065f46 100%)",
    description: "Sembang Offline menukar telefon Android anda menjadi Walkie-Talkie Push-to-Talk (PTT) fizikal tanpa sebarang internet, router Wi-Fi mahupun kad SIM. Menggunakan sambungan langsung Wi-Fi Direct antara 2 hingga 3 peranti, ia membolehkan perbualan suara berkumpulan secara serta-merta di kawasan tanpa liputan rangkaian.",
    highlights: [
      "100% Bebas Internet, Cloud & Kad SIM",
      "Push-To-Talk (PTT) Butang Besar Responsif",
      "Teknologi Sambungan Wi-Fi Direct (P2P Group)",
      "Privasi Maksimum: Tiada audio disimpan atau direkodkan"
    ],
    features: [
      "📻 Enjin Suara Masa Nyata: Kependaman sangat rendah (<50ms) menggunakan aliran paket UDP setempat.",
      "👥 Kumpulan 2 - 3 Telefon: Satu telefon bertindak sebagai Hos P2P dan telefon lain bersambung automatik.",
      "🔒 Privasi 100%: Audio suara tidak melalui mana-mana pelayan internet atau pihak ketiga.",
      "🌲 Sesuai Aktiviti Lasak: Amat ideal untuk berkhemah, konvoi kereta/motor, memancing dan tapak pembinaan."
    ],
    whatsNew: "Versi 1.0 dengan pengesanan peranti berdekatan dan protokol kawalan giliran bercakap (Floor Control).",
    minAndroid: "Android 8.0 (Oreo)+",
    packageName: "com.fishingcorp.sembangoffline"
  },
  {
    id: "smartbulbcctv",
    name: "SmartBulb CCTV Pro",
    subtitle: "Pengawal Kamera Mentol E27 Wi-Fi PTZ 360° (Direct LAN/AP)",
    developer: "FishingCorp Security",
    category: "utiliti",
    categoryName: "Keselamatan & Smart Home",
    version: "v1.0.0",
    fileSize: "13.3 MB",
    rating: 4.7,
    reviews: "1.1k",
    downloads: "4,200+",
    ageRating: "3+",
    icon: "assets/icons/smartbulbcctv.svg",
    apkFile: "apks/SmartBulbCCTV_v1.0.apk",
    badge: "Smart Home",
    featured: false,
    bannerColor: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
    description: "Kawal kamera keselamatan mentol lampu E27 PTZ anda secara terus melalui rangkaian Wi-Fi tempatan (LAN) atau mod AP Hotspot Kamera tanpa memerlukan aplikasi awan luar negara yang penuh iklan atau perlahan. Menyokong penstriman langsung RTSP/P2P, putaran 360°, lampu LED, dan interkom suara.",
    highlights: [
      "Sambungan Terus Tanpa Internet (Direct AP Hotspot)",
      "Kawalan Putaran Kamera 360° (Virtual Joystick PTZ)",
      "Suis Lampu Mentol LED Putih & Night Vision Inframerah",
      "Interkom 2-Hala Suara & Rakaman Video MP4 ke Galeri"
    ],
    features: [
      "📹 Enjin Aliran Pantas: Penstriman video definisi tinggi dengan penimbal kependaman sifar.",
      "💡 Kawalan Lampu Mentol Pintar: Hidupkan atau matikan lampu LED mentol terus dari telefon anda.",
      "🔄 Auto-Imbas Kamera Port 32108 & 554: Mengesan kamera dalam rangkaian secara automatik.",
      "🎙️ Push-to-Talk Intercom: Bercakap melalui pembesar suara kamera terus dari aplikasi."
    ],
    whatsNew: "Versi 1.0 pengikat paksa Wi-Fi pintar dan sokongan protokol dwi-mod RTSP + P2P UDP.",
    minAndroid: "Android 8.0 (Oreo)+",
    packageName: "com.smartbulb.cctv"
  },
  {
    id: "kampungwaze",
    name: "KampungWaze",
    subtitle: "Navigasi Lorong Desa & Jalan Komuniti Luar Bandar",
    developer: "Atoklure Komuniti",
    category: "navigasi",
    categoryName: "Navigasi & GPS",
    version: "v1.0.0",
    fileSize: "7.5 MB",
    rating: 4.7,
    reviews: "1.9k",
    downloads: "8,000+",
    ageRating: "3+",
    icon: "assets/icons/kampungwaze.png",
    apkFile: "apks/KampungWaze_v1.0.apk",
    badge: "Viral Desa",
    featured: false,
    bannerColor: "linear-gradient(135deg, #15803d 0%, #166534 100%)",
    description: "KampungWaze ialah aplikasi navigasi komuniti pertama yang memetakan lorong-lorong kecil, titi gantung, jambatan kayu, simpang tak bernama, dan laluan pintas ladang yang biasanya diabaikan oleh aplikasi peta arus perdana. Sangat berguna untuk penghantar barang, tetamu kenduri, dan kecemasan.",
    highlights: [
      "Peta khas lorong kecil dan jalan sawah/kebun",
      "Peringatan bahaya titi sempit & jalan berbonggol",
      "Sesuai untuk motosikal dan kenderaan ringan",
      "Simpanan peta setempat (Offline Cache)"
    ],
    features: [
      "🏍️ Laluan Khusus Motosikal & Kereta: Pilih jenis kenderaan untuk elak tersangkut di laluan sempit.",
      "⚠️ Laporan Komuniti Setempat: Amaran lembu melintas, pokok tumbang, kenduri kahwin, atau lopak dalam.",
      "🏠 Carian Nama Kampung Tradisi: Cari lokasi berdasarkan nama pekan, surau, parit atau bendang.",
      "🔋 Sangat Jimat Bateri & Ringan: Direka agar lancar pada telefon bajet atau lama."
    ],
    whatsNew: "Versi 1.0 pelancaran sulung peta laluan desa Malaysia.",
    minAndroid: "Android 6.0 (Marshmallow)+",
    packageName: "com.atoklure.kampungwaze"
  }
];
