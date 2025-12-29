@echo off
REM Script para exportar la base de datos MongoDB de SIAFF

echo ========================================
echo    SIAFF - Exportar Base de Datos
echo ========================================
echo.

cd /d "%~dp0.."

echo Ejecutando exportacion...
node database/export-database.cjs

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Exportacion completada exitosamente
    echo ========================================
) else (
    echo.
    echo ========================================
    echo   Error en la exportacion
    echo ========================================
)

echo.
pause
