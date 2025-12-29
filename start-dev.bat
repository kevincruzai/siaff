@echo off
REM SIAFF - Script de Inicio de Desarrollo (Windows)
REM ================================================

echo 🚀 Iniciando SIAFF en modo desarrollo...

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js primero.
    exit /b 1
)

REM Verificar archivos .env
if not exist ".env.local" (
    echo ⚠️  .env.local no encontrado, copiando desde .env.example
    copy .env.example .env.local
)

if not exist "backend\.env" (
    echo ⚠️  backend\.env no encontrado, copiando desde backend\.env.example
    copy backend\.env.example backend\.env
)

REM Instalar dependencias si es necesario
if not exist "node_modules" (
    echo 📦 Instalando dependencias del frontend...
    call npm install
)

if not exist "backend\node_modules" (
    echo 📦 Instalando dependencias del backend...
    cd backend
    call npm install
    cd ..
)

echo.
echo ✅ Iniciando servicios SIAFF...
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo.
echo Presiona Ctrl+C para detener todos los servicios
echo.

REM Iniciar backend en una nueva ventana
start "SIAFF Backend" cmd /k "cd backend && npm run dev"

REM Esperar un momento para que el backend inicie
timeout /t 3 /nobreak >nul

REM Iniciar frontend
npm run dev
