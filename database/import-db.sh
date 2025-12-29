#!/bin/bash

# Script para importar la base de datos MongoDB de SIAFF

echo "========================================"
echo "   SIAFF - Importar Base de Datos"
echo "========================================"
echo ""

# Cambiar al directorio del proyecto
cd "$(dirname "$0")/.."

if [ -z "$1" ]; then
    echo "Usando archivo latest: database/backups/siaff-db-latest.json"
    node database/import-database.cjs
else
    echo "Usando archivo: $1"
    node database/import-database.cjs "$1"
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  Importación completada exitosamente"
    echo "========================================"
else
    echo ""
    echo "========================================"
    echo "  Error en la importación"
    echo "========================================"
    exit 1
fi
