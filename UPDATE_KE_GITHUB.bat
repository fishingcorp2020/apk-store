@echo off
title Kemas Kini Atoklure Apps Store ke GitHub
cd /d "%~dp0"
echo ======================================================
echo    Menghantar Kemas Kini ke GitHub Pages...
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
