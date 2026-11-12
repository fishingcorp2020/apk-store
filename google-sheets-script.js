/**
 * GOOGLE APPS SCRIPT - REKOD USER & MUAT TURUN PLAYSTORE APK HUB
 * 
 * CARA GUNA:
 * 1. Buka Google Sheets baru di https://sheets.new
 * 2. Namakan spreadsheet: "PlayStore Hub - Rekod Muat Turun"
 * 3. Di menu atas, klik Extensions -> Apps Script
 * 4. Padam semua kod asal dan tampal SEMUA kod di bawah ini.
 * 5. Klik butang "Save" (ikon disket).
 * 6. Klik butang biru "Deploy" (atas kanan) -> pilih "New deployment".
 * 7. Pada ikon gear (Select type) -> pilih "Web app".
 *    - Description: "PlayStore Tracker"
 *    - Execute as: "Me" (email anda)
 *    - Who has access: "Anyone" (PENTING: pilih Anyone!)
 * 8. Klik "Deploy" -> "Authorize access" (pilih akaun Google anda -> Advanced -> Go to ...).
 * 9. Salin "Web app URL" (berakhir dengan /exec).
 * 10. Tampal URL tersebut ke dalam fail apps-data.js di bahagian sheetsWebhookUrl!
 */

function doPost(e) {
  try {
    var contents = e.postData.contents;
    var data = JSON.parse(contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.type === "login") {
      recordLogin(ss, data);
    } else if (data.type === "download") {
      recordDownload(ss, data);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Rekod Pengguna yang Log Masuk
function recordLogin(ss, data) {
  var sheet = ss.getSheetByName("Log Masuk");
  if (!sheet) {
    sheet = ss.insertSheet("Log Masuk");
    sheet.appendRow(["Tarikh & Masa", "Nama Pengguna", "Alamat Email", "Kaedah Log Masuk"]);
    formatHeaderRow(sheet);
  }
  sheet.appendRow([
    data.timestamp || new Date().toLocaleString("ms-MY"),
    data.userName || "Tidak Diketahui",
    data.userEmail || "Tidak Diketahui",
    data.provider || "google"
  ]);
}

// Rekod Aktiviti Muat Turun APK
function recordDownload(ss, data) {
  var sheet = ss.getSheetByName("Log Muat Turun");
  if (!sheet) {
    sheet = ss.insertSheet("Log Muat Turun");
    sheet.appendRow(["Tarikh & Masa", "Nama Aplikasi", "Versi", "Saiz Fail", "Nama Pengguna", "Alamat Email"]);
    formatHeaderRow(sheet);
  }
  sheet.appendRow([
    data.timestamp || new Date().toLocaleString("ms-MY"),
    data.appName || "Tidak Diketahui",
    data.appVersion || "-",
    data.fileSize || "-",
    data.userName || "Tidak Diketahui",
    data.userEmail || "Tidak Diketahui"
  ]);

  updateSummarySheet(ss);
}

// Format Baris Kepala Jadual
function formatHeaderRow(sheet) {
  var range = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  range.setBackground("#01875f");
  range.setFontColor("#ffffff");
  range.setFontWeight("bold");
  sheet.setFrozenRows(1);
}

// Kemas kini Tab Ringkasan & Kiraan Muat Turun
function updateSummarySheet(ss) {
  var sheet = ss.getSheetByName("Kiraan Muat Turun");
  if (!sheet) {
    sheet = ss.insertSheet("Kiraan Muat Turun", 0);
    sheet.appendRow(["Nama Aplikasi", "Jumlah Kali Dimuat Turun"]);
    formatHeaderRow(sheet);
  }

  var logSheet = ss.getSheetByName("Log Muat Turun");
  if (!logSheet || logSheet.getLastRow() < 2) return;

  var appNames = [
    "TV KITA Pro",
    "JetiNav All-Terrain",
    "CakapGo",
    "Daebak TV (대박 TV)",
    "StickerKilat",
    "Sembang Offline",
    "SmartBulb CCTV Pro",
    "KampungWaze"
  ];

  sheet.getRange(2, 1, sheet.getMaxRows() - 1, 2).clearContent();

  var rows = [];
  for (var i = 0; i < appNames.length; i++) {
    var formula = '=COUNTIF(\'Log Muat Turun\'!B2:B, "' + appNames[i] + '")';
    rows.push([appNames[i], formula]);
  }

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 2).setValues(rows);
  }
}
