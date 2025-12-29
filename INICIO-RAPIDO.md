# 🚀 GUÍA RÁPIDA DE INICIO - SIAFF

## ⚡ Inicio Rápido (Windows)

### Opción 1: Script Automático
```batch
start-dev.bat
```

### Opción 2: Manual
```batch
# 1. Copiar variables de entorno
copy .env.example .env.local
cd backend
copy .env.example .env
cd ..

# 2. Instalar (primera vez)
npm install
cd backend
npm install
cd ..

# 3. Iniciar backend (Terminal 1)
cd backend
npm run dev

# 4. Iniciar frontend (Terminal 2)
npm run dev
```

---

## 🐳 Con Docker

```bash
# Iniciar todo (MongoDB + Backend + Frontend)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

---

## 🔧 Comandos Esenciales

### Desarrollo
```bash
npm run dev              # Iniciar frontend
cd backend && npm run dev  # Iniciar backend
```

### Código
```bash
npm run lint            # Verificar errores
npm run lint:fix        # Corregir automáticamente
npm run format          # Formatear código
npm run type-check      # Verificar TypeScript
```

### Base de Datos
```bash
cd backend
npm run seed            # Seed con datos de prueba
npm run seed:dev        # Seed en desarrollo
```

### Build
```bash
npm run build           # Build para producción
npm run preview         # Preview del build
```

---

## 🌐 URLs del Proyecto

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health
- **MongoDB**: mongodb://localhost:27017/siaff-db

---

## 🔑 Credenciales de Prueba

### Admin del Sistema
- Email: `admin@siaff.net`
- Password: `admin123`
- Redirección: `/admin/user-management`

### CEO con Múltiples Empresas
- Email: `ceo@holding.com`
- Password: `ceo123`
- Empresas: 3 empresas

### Usuario Regular
- Email: `user@siaff.net`
- Password: `user123`
- Redirección: `/dashboard/financial-dashboard`

---

## 📦 Dependencias Requeridas

### Obligatorias
- ✅ Node.js >= 18.0.0
- ✅ MongoDB >= 7.0
- ✅ npm o yarn

### Opcionales
- Docker Desktop (para containerización)
- Git (control de versiones)

---

## 🆘 Problemas Comunes

### Puerto ocupado
```bash
# Windows - Liberar puerto
netstat -ano | findstr :5173
taskkill /PID <PID> /F

netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB no conecta
```bash
# Verificar que MongoDB esté corriendo
# Windows Services: buscar "MongoDB"
# O iniciar manualmente MongoDB
```

### node_modules corrupto
```bash
# Limpiar e reinstalar
npm run clean:all
npm install
cd backend
npm install
```

### Errores de TypeScript
```bash
# Reiniciar servidor TypeScript en VSCode
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

---

## 🎯 Siguiente: ¿Qué Hacer?

1. ✅ Iniciar proyecto con `start-dev.bat`
2. ✅ Abrir http://localhost:5173
3. ✅ Login con credenciales de prueba
4. ✅ Explorar el dashboard
5. ✅ Revisar código en VSCode
6. ✅ Hacer cambios y ver hot reload

---

## 📚 Documentación Completa

- [CONFIGURACIONES.md](CONFIGURACIONES.md) - Todas las configuraciones
- [RESUMEN-CONFIGURACIONES.md](RESUMEN-CONFIGURACIONES.md) - Resumen ejecutivo
- [README.md](README.md) - Información del proyecto
- [README-TECH.md](README-TECH.md) - Documentación técnica
- [ngrok-setup.md](ngrok-setup.md) - Configuración ngrok

---

## 💡 Tips

- **Format on Save**: Habilitado automáticamente en VSCode
- **Auto Lint**: Se ejecuta al guardar archivos
- **Hot Reload**: Cambios se reflejan instantáneamente
- **Type Check**: TypeScript verifica en tiempo real
- **Docker**: Usa Docker Compose para un setup completo

---

## 📞 Soporte

¿Problemas? Revisa:
1. Logs de la consola
2. Network tab del navegador
3. Terminal del backend
4. MongoDB logs

**Versión**: 2.0.0-multitenant  
**Stack**: React + TypeScript + Node.js + MongoDB + Express
