# ✅ CHECKLIST DE CONFIGURACIÓN - SIAFF

## 📋 Configuración Inicial

### Paso 1: Clonar Repositorio
- [ ] Clonar repositorio
- [ ] Navegar a la carpeta del proyecto

### Paso 2: Variables de Entorno

#### Frontend
- [ ] Copiar `.env.example` a `.env.local`
- [ ] Configurar `VITE_API_URL` (default: http://localhost:5000)
- [ ] Configurar otras variables según necesidad

#### Backend
- [ ] Copiar `backend/.env.example` a `backend/.env`
- [ ] Configurar `MONGODB_URI` (default: mongodb://localhost:27017/siaff-db)
- [ ] Configurar `JWT_SECRET` (cambiar en producción)
- [ ] Configurar `FRONTEND_URL` para CORS

### Paso 3: Instalar Dependencias
- [ ] Ejecutar `npm install` en raíz
- [ ] Ejecutar `npm install` en `backend/`
- [ ] Verificar que no hay errores

### Paso 4: Base de Datos
- [ ] Verificar que MongoDB esté instalado
- [ ] Iniciar MongoDB
- [ ] (Opcional) Ejecutar `npm run seed` en backend

### Paso 5: Iniciar Proyecto
- [ ] Opción 1: Ejecutar `start-dev.bat` (Windows)
- [ ] Opción 2: Iniciar backend y frontend manualmente
- [ ] Verificar que frontend abre en http://localhost:5173
- [ ] Verificar que backend responde en http://localhost:5000/api/health

---

## 🔧 Configuración de Desarrollo

### VSCode
- [ ] Instalar extensiones recomendadas (`.vscode/extensions.json`)
- [ ] Verificar que format-on-save está habilitado
- [ ] Verificar que ESLint está funcionando

### Git
- [ ] Configurar `.gitignore`
- [ ] Hacer commit inicial si es necesario
- [ ] Configurar Git hooks (opcional)

### Herramientas de Calidad
- [ ] Verificar que ESLint funciona: `npm run lint`
- [ ] Verificar que Prettier funciona: `npm run format:check`
- [ ] Verificar TypeScript: `npm run type-check`

---

## 🐳 Configuración Docker (Opcional)

### Instalación
- [ ] Instalar Docker Desktop
- [ ] Verificar que Docker está corriendo

### Configuración
- [ ] Copiar `.env.docker` a `.env` (o configurar variables)
- [ ] Revisar `docker-compose.yml`
- [ ] Ajustar puertos si es necesario

### Ejecución
- [ ] Ejecutar `docker-compose up -d`
- [ ] Verificar que todos los containers están corriendo
- [ ] Verificar logs con `docker-compose logs -f`
- [ ] Acceder a la aplicación

---

## 🌐 Configuración Ngrok (Para Demos)

### Instalación
- [ ] Instalar ngrok
- [ ] Crear cuenta en ngrok.com
- [ ] Obtener auth token

### Configuración Backend
- [ ] Iniciar backend: `npm run dev`
- [ ] En otra terminal: `ngrok http 5000`
- [ ] Copiar URL de ngrok
- [ ] Actualizar `FRONTEND_URL` en `backend/.env`

### Configuración Frontend
- [ ] Iniciar frontend: `npm run dev`
- [ ] En otra terminal: `ngrok http 5173`
- [ ] Copiar URL de ngrok
- [ ] Actualizar `VITE_NGROK_BACKEND_URL` en `.env.local`
- [ ] Configurar `VITE_NGROK_ENABLED=true`

---

## 🧪 Verificación de Configuración

### Testing Básico
- [ ] Frontend carga correctamente
- [ ] Backend responde a peticiones
- [ ] Login funciona con credenciales de prueba
- [ ] Dashboard se visualiza correctamente
- [ ] Hot reload funciona en desarrollo

### Testing de Seguridad
- [ ] CORS está configurado correctamente
- [ ] JWT tokens se generan correctamente
- [ ] Rutas protegidas requieren autenticación
- [ ] Rate limiting funciona

### Testing de Producción (Docker)
- [ ] Build de frontend exitoso
- [ ] Build de backend exitoso
- [ ] Containers inician correctamente
- [ ] Health checks pasan
- [ ] Aplicación accesible desde browser

---

## 📊 Checklist por Entorno

### Desarrollo Local
- [x] Variables de entorno configuradas
- [x] Dependencias instaladas
- [x] MongoDB corriendo
- [x] Backend iniciado
- [x] Frontend iniciado
- [x] ESLint y Prettier funcionando
- [x] Hot reload funcionando

### Staging/Testing
- [ ] Variables de entorno de staging
- [ ] Base de datos de testing
- [ ] Build de producción exitoso
- [ ] Tests pasando
- [ ] Docker containers funcionando

### Producción
- [ ] Variables de entorno de producción
- [ ] Base de datos de producción
- [ ] Secrets seguros (JWT, passwords)
- [ ] HTTPS configurado
- [ ] Monitoring configurado
- [ ] Backups configurados
- [ ] CI/CD configurado

---

## 🔒 Checklist de Seguridad

### Configuración Básica
- [x] Helmet configurado
- [x] CORS configurado correctamente
- [x] Rate limiting habilitado
- [x] JWT con secret seguro
- [x] Passwords hasheadas con bcrypt
- [x] Variables de entorno no commiteadas

### Producción
- [ ] Secrets en variables de entorno del servidor
- [ ] HTTPS habilitado
- [ ] Security headers configurados
- [ ] Database con autenticación
- [ ] Backups automáticos
- [ ] Logs de seguridad
- [ ] Monitoring de errores

---

## 📚 Recursos Adicionales

### Documentación
- [ ] Leer [INICIO-RAPIDO.md](INICIO-RAPIDO.md)
- [ ] Revisar [CONFIGURACIONES.md](CONFIGURACIONES.md)
- [ ] Consultar [README-TECH.md](README-TECH.md)

### Extensiones VSCode Recomendadas
- [ ] ESLint
- [ ] Prettier
- [ ] Docker
- [ ] MongoDB
- [ ] Tailwind CSS IntelliSense
- [ ] GitLens

### Herramientas Útiles
- [ ] Postman (testing API)
- [ ] MongoDB Compass (GUI para MongoDB)
- [ ] Docker Desktop
- [ ] ngrok (para demos)

---

## ✅ Verificación Final

Antes de empezar a desarrollar, verifica que:

- [x] ✅ Proyecto inicia sin errores
- [x] ✅ Frontend y backend se comunican
- [x] ✅ Login funciona
- [x] ✅ Hot reload funciona
- [x] ✅ ESLint no muestra errores
- [x] ✅ TypeScript no muestra errores
- [x] ✅ MongoDB conecta correctamente
- [x] ✅ Variables de entorno cargadas

### Si todo está ✅, ¡estás listo para desarrollar! 🚀

---

## 🆘 Problemas Comunes

### No inicia el proyecto
1. Verificar que Node.js >= 18
2. Verificar que MongoDB está corriendo
3. Verificar variables de entorno
4. Limpiar `node_modules` y reinstalar

### Errores de TypeScript
1. Ejecutar `npm run type-check`
2. Reiniciar TS Server en VSCode
3. Limpiar cache: `npm run clean`

### Error de CORS
1. Verificar `FRONTEND_URL` en backend
2. Verificar origen de la petición
3. Revisar logs del backend

### MongoDB no conecta
1. Verificar que MongoDB está instalado
2. Verificar que está corriendo
3. Verificar `MONGODB_URI` en `.env`

---

**Fecha**: Diciembre 29, 2025  
**Versión**: 2.0.0-multitenant  
**Estado**: ✅ Configuraciones implementadas
