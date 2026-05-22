# ── Stage 1: Build Angular SPA ───────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline

COPY . .

RUN npm run build:prod

# ── Stage 2: NGINX to serve ───────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Install openssl to generate self-signed cert
RUN apk add --no-cache openssl

# Generate self-signed certificate for local testing (valid for 10 years)
RUN openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt \
    -subj "/C=IT/ST=Italy/L=Local/O=Development/CN=localhost"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/warehouse/browser /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
