# ==============================================================================
# PANEL KAWALAN STATUS APLIKASI - ATOKLURE APPS STORE
# ==============================================================================

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

[System.Windows.Forms.Application]::EnableVisualStyles()

$repoDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $repoDir) { $repoDir = (Get-Location).Path }
Set-Location $repoDir

$appsFile = Join-Path $repoDir "apps-data.js"
if (-not (Test-Path $appsFile)) {
    [System.Windows.Forms.MessageBox]::Show("Fail apps-data.js tidak dijumpai di: $appsFile", "Ralat", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
    exit
}

# 1. Segerakkan dulu dari GitHub agar sentiasa yang paling terkini
try {
    $null = git pull origin main 2>&1
} catch {}

$content = [System.IO.File]::ReadAllText($appsFile, [System.Text.Encoding]::UTF8)

$appsList = @(
    @{ id = "tvkita"; name = "TV KITA Pro"; category = "Hiburan & TV" },
    @{ id = "jetinav"; name = "JetiNav All-Terrain"; category = "Navigasi & GPS" },
    @{ id = "cakapgo"; name = "CakapGo"; category = "Komunikasi & Bahasa" },
    @{ id = "daebaktv"; name = "Daebak TV (대박 TV)"; category = "Hiburan & Video" },
    @{ id = "stickerkilat"; name = "StickerKilat"; category = "Fotografi & Seni" },
    @{ id = "sembangoffline"; name = "Sembang Offline"; category = "Komunikasi & Suara" },
    @{ id = "smartbulbcctv"; name = "SmartBulb CCTV Pro"; category = "Keselamatan & CCTV" },
    @{ id = "kampungwaze"; name = "KampungWaze"; category = "Navigasi & GPS" }
)

# Cipta Tingkap Utama (Form)
$form = New-Object System.Windows.Forms.Form
$form.Text = "Kawalan Status Aplikasi - Atoklure Apps Store"
$form.Size = New-Object System.Drawing.Size(510, 680)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false
$form.BackColor = [System.Drawing.Color]::FromArgb(248, 250, 252)
$form.Font = New-Object System.Drawing.Font("Segoe UI", 9.5)

# Panel Tajuk (Header)
$headerPanel = New-Object System.Windows.Forms.Panel
$headerPanel.Dock = "Top"
$headerPanel.Height = 78
$headerPanel.BackColor = [System.Drawing.Color]::FromArgb(1, 135, 95)
$form.Controls.Add($headerPanel)

$headerTitle = New-Object System.Windows.Forms.Label
$headerTitle.Text = "⚙️ Kawalan Status 8 Aplikasi"
$headerTitle.Font = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
$headerTitle.ForeColor = [System.Drawing.Color]::White
$headerTitle.Location = New-Object System.Drawing.Point(20, 14)
$headerTitle.AutoSize = $true
$headerPanel.Controls.Add($headerTitle)

$headerSub = New-Object System.Windows.Forms.Label
$headerSub.Text = "Tick (☑) = Buka Muat Turun  |  Buang Tick (☐) = Diselenggara untuk Naik Taraf"
$headerSub.Font = New-Object System.Drawing.Font("Segoe UI", 9)
$headerSub.ForeColor = [System.Drawing.Color]::FromArgb(220, 252, 231)
$headerSub.Location = New-Object System.Drawing.Point(22, 45)
$headerSub.AutoSize = $true
$headerPanel.Controls.Add($headerSub)

# Panel Senarai Checkbox
$listPanel = New-Object System.Windows.Forms.Panel
$listPanel.Location = New-Object System.Drawing.Point(20, 92)
$listPanel.Size = New-Object System.Drawing.Size(455, 385)
$listPanel.BackColor = [System.Drawing.Color]::White
$listPanel.BorderStyle = "FixedSingle"
$form.Controls.Add($listPanel)

$checkboxes = @()
$statusLabels = @()

for ($i = 0; $i -lt $appsList.Count; $i++) {
    $app = $appsList[$i]
    $yPos = 12 + ($i * 46)

    # Tentukan status asal dari fail apps-data.js
    $isCurrentlyOpen = $true
    if ($content -match "id:\s*`"$($app.id)`"[\s\S]*?isOpen:\s*(true|false)") {
        $isCurrentlyOpen = ($Matches[1] -eq "true")
    }

    # Item Container
    $chk = New-Object System.Windows.Forms.CheckBox
    $chk.Text = "$($app.name) ($($app.category))"
    $chk.Location = New-Object System.Drawing.Point(16, $yPos)
    $chk.Size = New-Object System.Drawing.Size(300, 32)
    $chk.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
    $chk.Checked = $isCurrentlyOpen
    $chk.Cursor = [System.Windows.Forms.Cursors]::Hand
    $chk.Tag = $app.id

    # Label Status (Buka / Diselenggara)
    $lbl = New-Object System.Windows.Forms.Label
    $lbl.Location = New-Object System.Drawing.Point(322, ($yPos + 5))
    $lbl.Size = New-Object System.Drawing.Size(120, 24)
    $lbl.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)

    # Fungsi kemas kini warna & teks label status
    $updateLabel = {
        param($checkbox, $label)
        if ($checkbox.Checked) {
            $label.Text = "● AKTIF"
            $label.ForeColor = [System.Drawing.Color]::FromArgb(1, 135, 95)
        } else {
            $label.Text = "🔧 NAIK TARAF"
            $label.ForeColor = [System.Drawing.Color]::FromArgb(217, 119, 6)
        }
    }

    & $updateLabel $chk $lbl

    # Event bila user klik tick / buang tick
    $chk.Add_CheckedChanged({
        & $updateLabel $this $lbl
    }.GetNewClosure())

    $listPanel.Controls.Add($chk)
    $listPanel.Controls.Add($lbl)

    $checkboxes += $chk
    $statusLabels += $lbl
}

# Butang Pintas (Pilih Semua / Tutup Semua)
$btnSelectAll = New-Object System.Windows.Forms.Button
$btnSelectAll.Text = "☑ Buka Semua"
$btnSelectAll.Location = New-Object System.Drawing.Point(20, 488)
$btnSelectAll.Size = New-Object System.Drawing.Size(110, 30)
$btnSelectAll.Font = New-Object System.Drawing.Font("Segoe UI", 9)
$btnSelectAll.Cursor = [System.Windows.Forms.Cursors]::Hand
$btnSelectAll.Add_Click({
    foreach ($c in $checkboxes) { $c.Checked = $true }
})
$form.Controls.Add($btnSelectAll)

$btnDeselectAll = New-Object System.Windows.Forms.Button
$btnDeselectAll.Text = "☐ Tutup Semua"
$btnDeselectAll.Location = New-Object System.Drawing.Point(138, 488)
$btnDeselectAll.Size = New-Object System.Drawing.Size(110, 30)
$btnDeselectAll.Font = New-Object System.Drawing.Font("Segoe UI", 9)
$btnDeselectAll.Cursor = [System.Windows.Forms.Cursors]::Hand
$btnDeselectAll.Add_Click({
    foreach ($c in $checkboxes) { $c.Checked = $false }
})
$form.Controls.Add($btnDeselectAll)

# Label Status Tindakan
$statusFooter = New-Object System.Windows.Forms.Label
$statusFooter.Text = "Tandakan kotak di atas, kemudian klik butang hijau di bawah."
$statusFooter.Location = New-Object System.Drawing.Point(20, 526)
$statusFooter.Size = New-Object System.Drawing.Size(455, 20)
$statusFooter.Font = New-Object System.Drawing.Font("Segoe UI", 8.5)
$statusFooter.ForeColor = [System.Drawing.Color]::Gray
$form.Controls.Add($statusFooter)

# Butang Simpan & Push ke GitHub
$btnSave = New-Object System.Windows.Forms.Button
$btnSave.Text = "💾 SIMPAN & HANTAR KE GITHUB (1-KLIK)"
$btnSave.Location = New-Object System.Drawing.Point(20, 552)
$btnSave.Size = New-Object System.Drawing.Size(455, 48)
$btnSave.BackColor = [System.Drawing.Color]::FromArgb(1, 135, 95)
$btnSave.ForeColor = [System.Drawing.Color]::White
$btnSave.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$btnSave.Cursor = [System.Windows.Forms.Cursors]::Hand
$btnSave.FlatStyle = "Flat"
$btnSave.FlatAppearance.BorderSize = 0

$btnSave.Add_Click({
    $btnSave.Enabled = $false
    $btnSave.Text = "⏳ Sedang memproses... Sila tunggu..."
    $btnSave.BackColor = [System.Drawing.Color]::FromArgb(100, 116, 139)
    $statusFooter.Text = "1. Menyegerak data dari GitHub..."
    $form.Refresh()

    try {
        # 1. Pull terkini
        $null = git pull origin main 2>&1

        # 2. Kemas kini kandungan apps-data.js
        $currentText = [System.IO.File]::ReadAllText($appsFile, [System.Text.Encoding]::UTF8)

        foreach ($c in $checkboxes) {
            $appId = $c.Tag
            $val = if ($c.Checked) { "true" } else { "false" }
            $pattern = "(id:\s*`"$appId`"[\s\S]*?isOpen:\s*)(true|false)"
            $currentText = [System.Text.RegularExpressions.Regex]::Replace($currentText, $pattern, "`$1$val")
        }

        # Tulis kembali fail apps-data.js
        [System.IO.File]::WriteAllText($appsFile, $currentText, [System.Text.Encoding]::UTF8)

        $statusFooter.Text = "2. Menghantar ke GitHub Pages..."
        $form.Refresh()

        # 3. Git Add, Commit & Push
        $null = git add apps-data.js 2>&1
        $null = git commit -m "Kemas kini status aplikasi melalui panel kawalan" 2>&1
        $pushResult = git push origin main 2>&1

        $statusFooter.Text = "✅ Berjaya dikemas kini ke GitHub!"
        [System.Windows.Forms.MessageBox]::Show(
            "Perubahan status aplikasi anda telah BERJAYA disimpan dan dihantar ke GitHub!`n`nLaman web Atoklure Apps Store akan dikemas kini dalam masa 1 minit.`n`nLayari: https://fishingcorp2020.github.io/apk-store/",
            "Berjaya",
            [System.Windows.Forms.MessageBoxButtons]::OK,
            [System.Windows.Forms.MessageBoxIcon]::Information
        )
    } catch {
        [System.Windows.Forms.MessageBox]::Show("Ralat semasa menyimpan: " + $_.Exception.Message, "Ralat", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
    } finally {
        $btnSave.Enabled = $true
        $btnSave.Text = "💾 SIMPAN & HANTAR KE GITHUB (1-KLIK)"
        $btnSave.BackColor = [System.Drawing.Color]::FromArgb(1, 135, 95)
    }
})

$form.Controls.Add($btnSave)

# Paparkan Form
[void]$form.ShowDialog()
