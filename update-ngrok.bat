@echo off
echo ========================================
echo    SIAFF ngrok Configuration Script
echo ========================================
echo.

set /p BACKEND_URL="Ingresa la URL de ngrok del BACKEND (ej: https://abc123.ngrok-free.app): "

if "%BACKEND_URL%"=="" (
    echo Error: Debe ingresar la URL del backend
    pause
    exit /b 1
)

echo.
echo Actualizando configuracion...

echo // API Configuration > src\config\api.ts
echo const API_CONFIG = { >> src\config\api.ts
echo   // Durante desarrollo local >> src\config\api.ts
echo   LOCAL: 'http://localhost:5000', >> src\config\api.ts
echo   >> src\config\api.ts
echo   // Para ngrok (actualizar cuando cambies la URL de ngrok del backend) >> src\config\api.ts
echo   NGROK_BACKEND: '%BACKEND_URL%', >> src\config\api.ts
echo   >> src\config\api.ts
echo   // Detectar automaticamente el entorno >> src\config\api.ts
echo   getBaseURL: () =^> { >> src\config\api.ts
echo     // Si estamos en ngrok (URL contiene ngrok-free.app) >> src\config\api.ts
echo     if (window.location.hostname.includes('ngrok-free.app')) { >> src\config\api.ts
echo       return API_CONFIG.NGROK_BACKEND; >> src\config\api.ts
echo     } >> src\config\api.ts
echo     >> src\config\api.ts
echo     // Si estamos en desarrollo local >> src\config\api.ts
echo     return API_CONFIG.LOCAL; >> src\config\api.ts
echo   } >> src\config\api.ts
echo }; >> src\config\api.ts
echo. >> src\config\api.ts
echo export default API_CONFIG; >> src\config\api.ts

echo.
echo ✅ Configuracion actualizada!
echo.
echo Siguiente paso:
echo 1. Reinicia el frontend: npm run dev
echo 2. Comparte la URL del frontend ngrok con el cliente
echo.
pause