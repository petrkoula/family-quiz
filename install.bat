@echo off
echo ========================================
echo  Photo Quiz - Instalace
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js neni nainstalovany!
    echo.
    echo Prosim nainstalujte Node.js z:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js je nainstalovany.
node --version
echo.

echo Instaluji zavislosti...
echo.

npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Instalace selhala!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Instalace dokoncena!
echo ========================================
echo.
echo Pro spusteni serveru pouzijte: start-server.bat
echo.
pause
