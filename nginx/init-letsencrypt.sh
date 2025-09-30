#!/bin/bash

# File: ./init-letsencrypt.sh
# Script per inizializzare i certificati SSL con Let's Encrypt

DOMAIN="roberto-ingenito.ddns.net"
EMAIL="ingenitoroby@gmail.com" # Sostituisci con la tua email
STAGING=0 # Imposta a 1 se vuoi usare i server di staging per test

# Percorsi
DATA_PATH="./certbot"
NGINX_PATH="."

# Crea le directory necessarie
echo "### Creazione directory..."
mkdir -p "$DATA_PATH/conf"
mkdir -p "$DATA_PATH/www"
mkdir -p "$NGINX_PATH/conf.d"

# Scarica i parametri TLS raccomandati
echo "### Download parametri TLS raccomandati..."
if [ ! -e "$DATA_PATH/conf/options-ssl-nginx.conf" ]; then
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$DATA_PATH/conf/options-ssl-nginx.conf"
fi

if [ ! -e "$DATA_PATH/conf/ssl-dhparams.pem" ]; then
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$DATA_PATH/conf/ssl-dhparams.pem"
fi

# Crea un certificato temporaneo per avviare Nginx
echo "### Creazione certificato temporaneo..."
path="/etc/letsencrypt/live/$DOMAIN"
mkdir -p "$DATA_PATH/conf/live/$DOMAIN"
docker run --rm -v "$PWD/$DATA_PATH/conf:/etc/letsencrypt" \
    --entrypoint "/bin/sh" certbot/certbot \
    -c "openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=$DOMAIN'"

# Avvia Nginx
echo "### Avvio Nginx..."
docker compose up -d nginx

# Elimina il certificato temporaneo
echo "### Eliminazione certificato temporaneo..."
docker compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$DOMAIN && \
  rm -Rf /etc/letsencrypt/archive/$DOMAIN && \
  rm -Rf /etc/letsencrypt/renewal/$DOMAIN.conf" certbot

# Richiedi il certificato Let's Encrypt
echo "### Richiesta certificato Let's Encrypt..."

# Abilita staging mode se richiesto
if [ $STAGING != "0" ]; then 
  STAGING_ARG="--staging"
else
  STAGING_ARG=""
fi

docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $STAGING_ARG \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d $DOMAIN" certbot

# Ricarica Nginx con i nuovi certificati
echo "### Ricaricamento Nginx..."
docker compose exec nginx nginx -s reload

echo "### Setup completato!"
echo "### I certificati verranno rinnovati automaticamente ogni 12 ore."