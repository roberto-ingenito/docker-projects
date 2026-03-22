#!/bin/bash
# da eseguire SOLO la prima volta sul server

set -e

echo "🚀 Avvio nginx in modalità HTTP-only per la challenge ACME..."

# Avvia solo nginx con una config temporanea HTTP-only (senza ssl_certificate)
mv main-nginx/conf.d/ main-nginx/conf.d.temp
mkdir -p main-nginx/conf.d && cp main-nginx/temp.conf main-nginx/conf.d

docker compose restart main-nginx

echo "⏳ Attendo che nginx sia pronto..."
sleep 5

echo "🔐 Richiedo il certificato via webroot..."
docker compose run --rm --entrypoint certbot certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d roberto-ingenito.ddns.net \
  --email robe.ingenito@gmail.com \
  --agree-tos \
  --no-eff-email
  
sleep 3

# ripristino la configurazione originale
rm -rf main-nginx/conf.d
mv main-nginx/conf.d.temp main-nginx/conf.d/

echo "🔄 Riavvio nginx con SSL attivo..."
docker compose restart main-nginx

echo "✅ Certificati generati nel volume Docker 'letsencrypt_conf'"
echo "   Il container certbot si occuperà del rinnovo automatico ogni 12h"