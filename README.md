# 📱 PlayStore APK Hub

Gedung muat turun aplikasi Android peribadi & komuniti dengan rekaan moden ala **Google Play Store**. Lengkap dengan fungsi carian pintar, penapisan kategori, paparan butiran aplikasi (*Modal Detail*), pengimbas kod QR untuk muat turun terus ke telefon pintar, sokongan tema gelap/cerah, dan panduan pemasangan fail APK.

---

## ✨ Ciri-Ciri Utama
- 🎨 **Antaramuka Google Play Moden:** Menggunakan reka bentuk Material 3, kad aplikasi kemas, penarafan bintang, saiz fail, lencana Play Protect disahkan selamat.
- ⚡ **Pilihan Utama (Hero Carousel):** Menyerlahkan aplikasi terbaik seperti TV KITA, JetiNav, dan CakapGo.
- 🔍 **Carian Pantas & Kategori:** Pengguna boleh menaip apa-apa kata kunci atau memilih kategori (Navigasi & GPS, Hiburan & TV, Komunikasi, Utiliti).
- 📲 **Imbas Kod QR:** Pengguna di komputer boleh klik butang "Kod QR" dan imbas terus menggunakan kamera telefon untuk muat turun APK tanpa kabel data.
- 🌙 **Mod Gelap & Cerah:** Butang penukar tema automatik disimpan dalam memori pelayar pengguna.
- 📋 **Panduan Pemasangan APK:** Panduan bergambar untuk meluluskan *"Install Unknown Apps"* pada telefon Samsung, Xiaomi/Redmi, Vivo, dan Oppo.
- 🔗 **Pautan Terus (Deep Linking):** Boleh kongsi link terus ke sesuatu aplikasi (contoh: `index.html#tvkita`).

---

## 📦 Senarai 8 Aplikasi Sedia Ada
1. **TV KITA Pro (`v1.2.0` - 2.8 MB):** Siaran TV Malaysia lengkap, sukan, berita & arkib VOD.
2. **JetiNav All-Terrain (`v2.0.0` - 7.5 MB):** GPS navigasi luar talian tanpa internet untuk pemancing & aktiviti hutan.
3. **CakapGo (`v1.0.0` - 77.7 MB):** Penterjemah suara pintar, kamus frasa & Romanizer sebutan Korea.
4. **Daebak TV (`v1.0.0` - 1.9 MB):** Strim filem & drama Korea percuma VIP, mesra Android Box TV.
5. **StickerKilat (`v1.0.0` - 2.0 MB):** Pembuat sticker WhatsApp, Auto Cut AI, garisan border die-cut & teks slang.
6. **Sembang Offline (`v1.0.0` - 15.8 MB):** Walkie-Talkie Push-to-Talk (PTT) melalui Wi-Fi Direct tanpa internet/SIM.
7. **SmartBulb CCTV Pro (`v1.0.0` - 13.3 MB):** Pengawal kamera mentol PTZ 360°, lampu LED & interkom terus LAN/AP.
8. **KampungWaze (`v1.0.0` - 7.5 MB):** Navigasi lorong kampung, jambatan kayu, titi gantung & amaran komuniti.

---

## 🚀 Cara Uji Secara Tempatan (Offline di PC)
1. Buka folder:
   `c:\Users\StafUUM_PC\Desktop\design\apk-store`
2. Klik dua kali pada fail **`index.html`** untuk membukanya dalam Google Chrome, Edge, atau Firefox.
3. Semua fungsi carian, kategori, modal, dan butang muat turun akan terus berfungsi!

---

## 🌐 Cara Terbitkan ke GitHub Pages (Percuma)

Ikuti langkah mudah ini untuk menjadikan web store ini boleh diakses oleh semua pengguna anda di internet:

### Langkah 1: Cipta Repository Baharu di GitHub
1. Buka pelayar web dan layari [https://github.com/new](https://github.com/new).
2. Log masuk ke akaun GitHub anda (`fishingcorp2020`).
3. Tetapkan:
   - **Repository name:** `apk-store`
   - **Visibility:** `Public` (Wajib Public untuk GitHub Pages percuma)
   - Jangan tandakan *Add README* atau *.gitignore* (biarkan kosong).
4. Tekan butang hijau **Create repository**.

### Langkah 2: Muat Naik Fail dari PC Anda (Git Push)
Buka terminal PowerShell di PC anda dan jalankan arahan berikut:

```powershell
cd c:\Users\StafUUM_PC\Desktop\design\apk-store
git init
git add .
git commit -m "Pelancaran sulung PlayStore APK Hub"
git branch -M main
git remote add origin https://github.com/fishingcorp2020/apk-store.git
git push -u origin main
```

*(Jika GitHub meminta kebenaran, satu tetingkap pelayar akan muncul untuk anda klik **Authorize**).*

### Langkah 3: Aktifkan GitHub Pages
1. Masuk ke laman repositori anda di GitHub: `https://github.com/fishingcorp2020/apk-store`.
2. Klik tab **Settings** (atas kanan repositori).
3. Di menu sebelah kiri, klik **Pages**.
4. Di bawah bahagian **Build and deployment -> Branch**:
   - Pilih branch: **`main`**
   - Folder: **`/(root)`**
   - Klik **Save**.
5. Tunggu 1 hingga 2 minit. GitHub akan memberikan pautan web rasmi anda:
   👉 **`https://fishingcorp2020.github.io/apk-store`**

Kini semua kawan dan pengguna anda boleh buka link tersebut di telefon atau PC dan muat turun apa-apa aplikasi pada bila-bila masa!

---

## ➕ Cara Tambah Aplikasi Baharu pada Masa Hadapan
1. Letakkan fail `.apk` baharu anda ke dalam folder `apks/`.
2. Masukkan gambar ikon aplikasi ke dalam folder `assets/icons/`.
3. Buka fail **`apps-data.js`** dan tambah satu blok data mengikut format sedia ada.
4. Lakukan `git add .`, `git commit -m "Tambah app baru"`, dan `git push`. Halaman store akan dikemas kini secara automatik!
