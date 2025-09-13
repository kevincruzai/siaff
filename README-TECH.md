SIAFF – Plataforma de Flujo de Efectivo y Proyecciones (Plantilla Técnica)

SIAFF es un sistema financiero SaaS para control, análisis y proyección del flujo de caja, presupuestos, consolidación multi-empresa y reportería analítica. Esta plantilla técnica reutiliza la arquitectura del proyecto Zhagra (monorepo, FE/BE separados, tiempo real, simulador), pero con exigencias financieras: exactitud monetaria, auditoría, multimoneda, seguridad por inquilino (multi-tenant) y cumplimiento.

# 📁 Estructura del Monorepo

siaff/  
├── package.json  
├── vite.config.ts  
├── tailwind.config.js  
│  
├── backend/  
│ ├── package.json  
│ ├── prisma/  
│ │ ├── schema.prisma  
│ │ ├── migrations/  
│ │ └── seed.ts  
│ └── src/  
│ ├── index.ts  
│ ├── config/  
│ ├── middleware/  
│ ├── modules/  
│ ├── routes/  
│ ├── services/  
│ ├── repositories/  
│ ├── dtos/  
│ ├── utils/  
│ └── telemetry/  
│  
├── src/  
│ ├── pages/  
│ ├── components/  
│ ├── services/  
│ ├── contexts/  
│ ├── hooks/  
│ └── theme/  
│  
├── tools/  
│ └── finance-debug/  
│ ├── package.json  
│ └── src/index.ts  
│  
└── public/

# 🚀 Stack Tecnológico

Frontend:  
\- React 18, TypeScript, Vite  
\- Tailwind CSS, React Router  
\- Recharts, Axios, Context API  
<br/>Backend:  
\- Node.js + TypeScript + Express  
\- Prisma + PostgreSQL 16+  
\- JWT, Helmet, CORS, Rate Limit  
\- Zod/Valibot, Socket.IO, BullMQ  
<br/>Base de Datos:  
\- PostgreSQL 16+ con Decimal  
\- RLS por tenant_id  
\- Particionado y vistas materializadas  
<br/>Observabilidad:  
\- OpenTelemetry  
\- Winston/Pino logs  
\- Health checks

# 🔐 Entorno y Variables

Backend – .env  
DATABASE_URL="postgresql://user:pass@localhost:5432/siaff?schema=public"  
JWT_ACCESS_TTL="900s"  
JWT_REFRESH_TTL="7d"  
JWT_SECRET="replace-me"  
FRONTEND_URL="<http://localhost:5173>"  
APP_REQUIRE_RLS="true"  
OTEL_EXPORTER_OTLP_ENDPOINT="<http://localhost:4317>"  
<br/>Frontend – .env.local  
VITE_API_URL="<http://localhost:3000/api>"  
VITE_SOCKET_URL="<http://localhost:3000>"  

# 🏃 Comandos Principales

Raíz:  
npm install  
npm run dev  
<br/>Frontend:  
npm run dev:fe  
npm run build:fe  
npm run preview  
<br/>Backend:  
npm run dev:be  
npm run build:be  
npm run start:be  
npm run prisma:generate  
npm run prisma:migrate  
npm run prisma:studio  
npm run seed  
<br/>Simulador Financiero:  
cd tools/finance-debug  
npm install  
npm start

# 🧱 Esquema de Datos (Prisma) – Núcleo Financiero

Se incluyen entidades Tenant, Company, BusinessUnit, User, UserTenant, Account, JournalEntry, JournalLine, FxRate, ForecastScenario, ForecastSnapshot, todas con claves UUID y uso de Decimal(19,4) para montos.

# 🔒 Seguridad Multi-Tenant (RLS en PostgreSQL)

Aplicar Row Level Security (RLS) en tablas de negocio. Configuración de \`app.tenant_id\` en la conexión por middleware. Ejemplo de políticas RLS incluidas para Company, Account, JournalEntry, JournalLine.

# 🧮 Reglas Financieras Clave

\- Validar doble partida (Σdebit = Σcredit)  
\- Montos con Decimal  
\- Moneda por línea + fxRate  
\- Periodos contables (apertura/cierre)  
\- Auditoría de cambios y accesos

# 🛣️ Endpoints (ejemplo)

Auth, Tenancy, Plan de cuentas, Journal, Cashflow, Budgets, FX, Forecasting

# 🎨 Dashboards (FE)

Cashflow, Presupuestos vs Real, Consolidación, FX Impact, Proyecciones

# 🎛️ Simulador Financiero (Tools)

Genera datos sintéticos para pruebas/demos. Publica cash_in, cash_out, net_flow, fx_rate, shocks.

# 🧪 Testing & Calidad

\- Unit: lógica de asientos, cierre de periodos  
\- Integration: endpoints, RLS  
\- Property-based: Σdebits=Σcredits  
\- Fixtures: datos sintéticos no-PII

# 🏗️ Despliegue

\- Docker Compose local (API+PG+Redis+OTEL)  
\- Prod: RDS/Aurora, jobs worker, Vault/Doppler, PITR backups, Blue/Green deploy  
\- Prisma migrate deploy, refresh concurrente de vistas materializadas

# 📈 Observabilidad / Health

GET /api/health  
Logs estructurados  
Alertas (latencia, errores, jobs encolados)

# ✅ Checklist de Seguridad

\- JWT corto + refresh  
\- 2FA / SSO  
\- RLS en todas las tablas  
\- Rate limit + IP allowlist  
\- Auditoría de cambios  
\- Backups verificados  
\- Retención por país

# 📚 Licencia y Contacto

\- Licencia: por definir  
\- Contacto: tu correo  
\- Sitio: <https://siaff.net>