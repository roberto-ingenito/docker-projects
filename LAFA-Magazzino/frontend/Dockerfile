# ── Stage 1: Build Angular SPA ───────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline

COPY . .

RUN npm run build:prod

# ── Stage 2: NGINX to serve ───────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
# Serve under /lafa-magazzino/ sub-path
COPY --from=build /app/dist/warehouse/browser /usr/share/nginx/html/lafa-magazzino

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
