@echo off
cd /d "%~dp0"
title EduPortal Server - ATBMHTTT Nhom 6

echo ========================================================
echo   KHOI DONG HE THONG EDUPORTAL - ATBMHTTT
echo ========================================================
echo.
echo [1/2] Dang khoi dong EduPortal Main Server (Port 3000)...
start "EduPortal Main Server (3000)" cmd /k "cd /d ""%~dp0"" && node server.js"

echo [2/2] Dang khoi dong Attacker Server (Port 4000)...
start "Attacker Server (4000)" cmd /k "cd /d ""%~dp0"" && node attacker_server.js"

ping 127.0.0.1 -n 3 > nul

echo.
echo ========================================================
echo   HE THONG DA SAN SANG:
echo   - EduPortal:        http://localhost:3000/login
echo   - CSRF Attack:      http://localhost:4000/tailieu-khoaluan.html
echo   - CORS Attack:      http://localhost:4000/test-site.html
echo   - Clickjacking:     http://localhost:4000/test-clickjacking.html
echo ========================================================
echo.
echo Dang mo trinh duyet...
start http://localhost:3000/login

echo.
echo Nhan phim bat ky de dong cua so nay...
pause > nul
