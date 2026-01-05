# ===============================
# STAGE 1: Dependencies
# ===============================
FROM node:20-alpine AS deps
# libc6-compat è spesso necessario su Alpine per alcune librerie
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiamo i file di dipendenza
COPY package.json package-lock.json* ./
# Installiamo le dipendenze
RUN npm ci

# ===============================
# STAGE 2: Builder
# ===============================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accettiamo l'argomento passato dal docker-compose
ARG NEXT_PUBLIC_API_URL
# Lo impostiamo come variabile d'ambiente per il momento della build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Disabilitiamo la telemetria di Next.js durante la build
ENV NEXT_TELEMETRY_DISABLED 1

# Compiliamo il progetto
RUN npm run build

# ===============================
# STAGE 3: Runner
# ===============================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

# Creiamo un utente non-root per sicurezza
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamo la cartella public (immagini, favicon, ecc.)
COPY --from=builder /app/public ./public

# Copiamo la build standalone (grazie a output: 'standalone' nel config)
# Questo riduce drasticamente la dimensione dell'immagine copiando solo i file necessari
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Impostiamo l'utente corretto
USER nextjs

EXPOSE 3000

# Next.js in modalità standalone crea un server.js custom
CMD ["node", "server.js"]