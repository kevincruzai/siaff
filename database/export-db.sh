#!/bin/bash

# Script para exportar la base de datos MongoDB de SIAFF

echo "========================================"
echo "   SIAFF - Exportar Base de Datos"
echo "========================================"
echo ""

# Cambiar al directorio del proyecto
cd "$(dirname "$0")/.."

echo "Ejecutando exportación..."
node database/export-database.cjs

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  Exportación completada exitosamente"
    echo "========================================"
else
    echo ""
    echo "========================================"
    echo "  Error en la exportación"
    echo "========================================"
    exit 1
fi
