#!/bin/bash

# SIAFF - Script de Inicio de Desarrollo
# =======================================

echo "🚀 Iniciando SIAFF en modo desarrollo..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js primero."
    exit 1
fi

# Verificar si MongoDB está corriendo
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB no está corriendo. Intenta iniciarlo con: sudo systemctl start mongod"
fi

# Verificar archivos .env
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local no encontrado, copiando desde .env.example"
    cp .env.example .env.local
fi

if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env no encontrado, copiando desde backend/.env.example"
    cp backend/.env.example backend/.env
fi

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    cd backend && npm install && cd ..
fi

# Iniciar servicios
echo "🌟 Iniciando backend en puerto 5000..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "🎨 Iniciando frontend en puerto 5173..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ SIAFF está corriendo:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Presiona Ctrl+C para detener todos los servicios"

# Capturar Ctrl+C y limpiar procesos
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# Esperar
wait
