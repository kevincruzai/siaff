# 🗄️ SIAFF - Gestión de Base de Datos

Este directorio contiene scripts y backups para la gestión de la base de datos MongoDB de SIAFF.

---

## 📁 Estructura

```
database/
├── backups/                    # Backups de la base de datos
│   ├── siaff-db-latest.json   # Último backup
│   └── siaff-db-YYYY-MM-DD-HHMMSS.json  # Backups con timestamp
├── export-database.js          # Script de exportación (Node.js)
├── import-database.js          # Script de importación (Node.js)
├── export-db.bat              # Script Windows para exportar
├── import-db.bat              # Script Windows para importar
├── export-db.sh               # Script Linux/Mac para exportar
└── import-db.sh               # Script Linux/Mac para importar
```

---

## 🚀 Uso Rápido

### Windows

#### Exportar Base de Datos
```batch
cd database
export-db.bat
```

#### Importar Base de Datos (Latest)
```batch
cd database
import-db.bat
```

#### Importar Base de Datos Específica
```batch
cd database
import-db.bat backups\siaff-db-2025-12-29-143000.json
```

### Linux/Mac

#### Exportar Base de Datos
```bash
cd database
chmod +x export-db.sh
./export-db.sh
```

#### Importar Base de Datos (Latest)
```bash
cd database
chmod +x import-db.sh
./import-db.sh
```

#### Importar Base de Datos Específica
```bash
cd database
./import-db.sh backups/siaff-db-2025-12-29-143000.json
```

---

## 📝 Uso Manual (Node.js)

### Exportar
```bash
# Desde la raíz del proyecto
node database/export-database.js
```

### Importar
```bash
# Desde la raíz del proyecto
node database/import-database.js

# O especificar archivo
node database/import-database.js database/backups/siaff-db-2025-12-29-143000.json
```

---

## 📊 Formato del Backup

Los backups se guardan en formato JSON con la siguiente estructura:

```json
{
  "exportDate": "2025-12-29T14:30:00.000Z",
  "version": "2.0.0-multitenant",
  "database": "siaff-db",
  "collections": {
    "users": [...],
    "companies": [...],
    "userCompanies": [...],
    "accountCatalogs": [...]
  },
  "stats": {
    "totalUsers": 10,
    "totalCompanies": 5,
    "totalUserCompanies": 15,
    "totalAccountCatalogs": 100
  }
}
```

---

## 🔄 Scripts NPM

Agrega estos scripts al `package.json` del backend:

```json
{
  "scripts": {
    "db:export": "node ../database/export-database.js",
    "db:import": "node ../database/import-database.js",
    "db:backup": "npm run db:export"
  }
}
```

Uso:
```bash
cd backend
npm run db:export  # Exportar
npm run db:import  # Importar latest
```

---

## ⚠️ Consideraciones Importantes

### Exportación
- ✅ Crea un backup con timestamp
- ✅ Crea una copia "latest" para facilitar importación
- ✅ Incluye todas las colecciones principales
- ✅ Formato JSON legible y fácil de versionar

### Importación
- ⚠️ **ELIMINA TODOS LOS DATOS EXISTENTES**
- ⚠️ Espera 5 segundos antes de ejecutar (tiempo para cancelar con Ctrl+C)
- ✅ Importa todas las colecciones del backup
- ✅ Mantiene las relaciones entre documentos

### Seguridad
- 🔒 Los archivos `.json` contienen datos sensibles
- 🔒 Agregar `database/backups/*.json` al `.gitignore` si es necesario
- 🔒 No compartir backups de producción públicamente
- 🔒 Cifrar backups de producción

---

## 📋 Colecciones Incluidas

1. **users** - Usuarios del sistema
   - Credenciales
   - Información personal
   - Roles globales

2. **companies** - Empresas registradas
   - Información de la empresa
   - Planes de suscripción
   - Configuraciones

3. **userCompanies** - Relación usuarios-empresas
   - Roles por empresa
   - Permisos específicos
   - Estado de acceso

4. **accountCatalogs** - Catálogo de cuentas contables
   - Cuentas por empresa
   - Jerarquía de cuentas
   - Configuración contable

---

## 🔧 Troubleshooting

### Error: "Cannot connect to MongoDB"
```bash
# Verificar que MongoDB está corriendo
# Windows: Services → MongoDB
# Linux: sudo systemctl status mongod
```

### Error: "File not found"
```bash
# Verificar que el archivo existe
ls database/backups/

# Usar ruta completa
node database/import-database.js "C:\repository\siaff-ai\database\backups\siaff-db-latest.json"
```

### Error: "Module not found"
```bash
# Instalar dependencias del backend
cd backend
npm install
```

---

## 💡 Tips

### Backup Antes de Cambios Importantes
```bash
# Antes de migrations o cambios grandes
cd database
./export-db.bat  # o .sh en Linux
```

### Restaurar a Estado Anterior
```bash
# Si algo sale mal, restaurar backup
cd database
./import-db.bat backups\siaff-db-2025-12-29-143000.json
```

### Backup Automático Periódico
Agregar a cron (Linux) o Task Scheduler (Windows):
```bash
# Diario a las 2 AM
0 2 * * * cd /path/to/siaff-ai/database && ./export-db.sh
```

### Versionado de Backups
```bash
# Los backups incluyen timestamp
# Mantener backups importantes con nombre descriptivo
cp backups/siaff-db-latest.json backups/siaff-db-before-migration-v2.json
```

---

## 📚 Recursos Adicionales

- MongoDB Documentation: https://docs.mongodb.com/
- Mongoose Documentation: https://mongoosejs.com/
- Best Practices: https://docs.mongodb.com/manual/administration/backup/

---

**Versión**: 2.0.0-multitenant  
**Última actualización**: Diciembre 29, 2025
