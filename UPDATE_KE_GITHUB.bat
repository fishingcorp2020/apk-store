@echo off
title Kemas Kini Atoklure Apps Store ke GitHub
cd /d "%~dp0"

echo ======================================================
echo    1. Menyegerak data terkini dari GitHub...
echo ======================================================
git pull origin main
echo.

echo ======================================================
echo    2. Menghantar Kemas Kini Anda ke GitHub Pages...
echo ======================================================
git add .
git commit -m "Kemas kini status app & tetapan store"
git push origin main
echo.

echo ======================================================
echo    SELESAI! Laman web dikemas kini dalam masa 1 minit.
echo    Link Store: https://fishingcorp2020.github.io/apk-store/
echo ======================================================
pause
