# Multi-stage build para optimizar tamaño
FROM node:18-alpine AS base

# Etapa de dependencias
FROM base AS deps
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Etapa de construcción
FROM base AS builder
WORKDIR /app

# Copiar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Etapa de producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 siaffuser

# Copiar dependencias de producción
COPY --from=deps --chown=siaffuser:nodejs /app/node_modules ./node_modules

# Copiar build
COPY --from=builder --chown=siaffuser:nodejs /app/dist ./dist
COPY --from=builder --chown=siaffuser:nodejs /app/package*.json ./

# Cambiar a usuario no-root
USER siaffuser

# Exponer puerto
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5173/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicio
CMD ["npm", "run", "preview"]
