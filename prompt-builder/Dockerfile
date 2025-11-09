# --- FASE 1: Build ---
FROM node:24.9.0-alpine3.21 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- FASE 2: Production ---
FROM node:24.9.0-alpine3.21 

WORKDIR /app

# serve per servire file statici
RUN npm install -g serve

COPY --from=builder /app/out ./out

EXPOSE 3000

# Serve i file statici sulla porta 3000
CMD ["serve", "-s", "out", "-l", "3000"]