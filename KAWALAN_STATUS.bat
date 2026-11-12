@echo off
title Kawalan Status Aplikasi - Atoklure Apps Store
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0kawalan-status.ps1"
