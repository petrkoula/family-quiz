@echo off
echo ========================================
echo  Photo Quiz Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo ERROR: Zavislosti nejsou nainstalovany!
    echo Prosim spustte nejdrive: install.bat
    echo.
    pause
    exit /b 1
)

echo Spoustim server...
echo.
echo Po spusteni otevrete v prohlizeci:
echo - Prezentace: http://localhost:3000/index.html
echo - Admin panel: http://localhost:3000/admin.html
echo.
echo Pro ukonceni stisknete Ctrl+C
echo.
echo ========================================
echo.

node server.js

pause
