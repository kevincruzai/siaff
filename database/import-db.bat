@echo off
REM Script para importar la base de datos MongoDB de SIAFF

echo ========================================
echo    SIAFF - Importar Base de Datos
echo ========================================
echo.

cd /d "%~dp0.."

if "%1"=="" (
    echo Usando archivo latest: database/backups/siaff-db-latest.json
    node database/import-database.cjs
) else (
    echo Usando archivo: %1
    node database/import-database.cjs %1
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Importacion completada exitosamente
    echo ========================================
) else (
    echo.
    echo ========================================
    echo   Error en la importacion
    echo ========================================
)

echo.
pause
