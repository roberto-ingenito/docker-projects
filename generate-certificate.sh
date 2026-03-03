#!/bin/bash

# Ferma nginx se è attivo (per liberare la porta 80)
docker compose down

# Installa certbot se non è già installato
sudo apt update
sudo apt install certbot -y

# Crea le directory necessarie
mkdir -p main-nginx/certbot/conf
mkdir -p main-nginx/certbot/www

# Genera i certificati (certbot usa la porta 80)
sudo certbot certonly --standalone -d roberto-ingenito.ddns.net --email robe.ingenito@gmail.com --agree-tos --no-eff-email

# Copia i certificati nella cartella che nginx si aspetta
sudo cp -r /etc/letsencrypt/live main-nginx/certbot/conf/
sudo cp -r /etc/letsencrypt/archive main-nginx/certbot/conf/
sudo cp -r /etc/letsencrypt/renewal main-nginx/certbot/conf/

# Correggi i permessi
sudo chown -R $USER:$USER main-nginx/certbot/conf
sudo chmod -R 755 main-nginx/certbot/conf

echo "✅ Certificati generati e configurati!"
echo "I certificati si rinnoveranno automaticamente tramite il container certbot"