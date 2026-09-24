@echo off
cd /d "%~dp0"
title Reset Du Lieu - EduPortal

echo ========================================================
echo   DANG KHOI PHUC DU LIEU BAN DAU (DATA RESET)...
echo ========================================================

powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:3000/api/reset-all' -Method Post -TimeoutSec 2 | Out-Null } catch {}"
copy /Y "%~dp0data_initial.json" "%~dp0data.json" > nul

echo.
echo [OK] DA KHOI PHUC DU LIEU BAN DAU THANH CONG!
echo   - Binh luan XSS: da reset
echo   - De tai #87 cua C: ve trang thai 'Cho duyet'
echo   - Thong bao CSRF: da xoa sach
echo   - Phien dang nhap: da reset
echo.
echo Ban co the quay lai canh quay ngay bay gio!
ping 127.0.0.1 -n 2 > nul
