# --- FASE 1: Build ---
FROM node:24.9.0-alpine3.21 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- FASE 2: Production ---
FROM node:24.9.0-alpine3.21 

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 5002

# Aggiungi --no-port-switching e specifica l'host 0.0.0.0
CMD ["serve", "-s", "dist", "-p", "5002", "--no-port-switching"]