# Configuración de ngrok para SIAFF

## Pasos para configurar ngrok y mostrar al cliente:

### 1. Instalar ngrok (si no está instalado)
```bash
# Descargar desde https://ngrok.com/download
# O instalar con chocolatey (Windows)
choco install ngrok

# O con npm globalmente
npm install -g ngrok
```

### 2. Configurar authtoken (registrarse en ngrok.com)
```bash
ngrok authtoken TU_TOKEN_AQUI
```

### 3. Ejecutar el backend
```bash
cd backend
npm start
```

### 4. Ejecutar el frontend
```bash
npm run dev
```

### 5. Crear túneles ngrok para frontend Y backend

**Terminal 1 - Frontend:**
```bash
ngrok http 5173 --host-header="localhost:5173"
```

**Terminal 2 - Backend:**
```bash
ngrok http 5000 --host-header="localhost:5000"
```

Esto te dará dos URLs:
- Frontend: `https://abc123.ngrok-free.app` 
- Backend: `https://def456.ngrok-free.app`

### 6. Actualizar configuración con las NUEVAS URLs de ngrok

Si ngrok te da URLs diferentes, actualiza:

**src/config/api.ts:**
```typescript
NGROK_BACKEND: 'https://TU_URL_NGROK_BACKEND.ngrok-free.app',
```

**vite.config.ts:**
```typescript
allowedHosts: [
  'localhost',
  '127.0.0.1',
  'TU_URL_NGROK_FRONTEND.ngrok-free.app',
  '.ngrok-free.app',
],
```

**backend/.env:**
```
FRONTEND_URL=http://localhost:5173,https://TU_URL_NGROK_FRONTEND.ngrok-free.app
```

### 7. Reiniciar servicios
Después de cambiar la configuración:
1. Reiniciar el backend: `Ctrl+C` y `npm start`
2. Reiniciar el frontend: `Ctrl+C` y `npm run dev`

## Credenciales para el cliente:

**Admin del Sistema:**
- Email: admin@siaff.net
- Password: admin123
- Funcionalidad: Panel de administración de usuarios

**CEO con Múltiples Empresas:**
- Email: ceo@holding.com  
- Password: ceo123
- Funcionalidad: Selector de empresas, dashboard financiero

**Usuario Regular:**
- Email: user@siaff.net
- Password: user123
- Funcionalidad: Dashboard financiero básico

## URL para compartir:
```
Frontend: https://TU_URL_NGROK_FRONTEND.ngrok-free.app
Backend: https://TU_URL_NGROK_BACKEND.ngrok-free.app
```

## Pasos rápidos para demo:

1. **Obtén la URL del backend de ngrok** (ej: `https://def456.ngrok-free.app`)

2. **Actualiza src/config/api.ts:**
   ```typescript
   NGROK_BACKEND: 'https://def456.ngrok-free.app',
   ```

3. **Reinicia el frontend:** `npm run dev`

4. **Comparte la URL del frontend** con el cliente

## Notas importantes:
- ngrok gratuito tiene límite de conexiones concurrentes
- La URL de ngrok cambia cada vez que se reinicia (excepto con plan de pago)
- Para producción, considerar un dominio propio y certificado SSL