#!/bin/bash

# Ferma nginx se è attivo (per liberare la porta 80)
docker compose down

# Installa certbot se non è già installato
sudo apt update
sudo apt install certbot -y

# Crea le directory necessarie
mkdir -p nginx/certbot/conf
mkdir -p nginx/certbot/www

# Genera i certificati (certbot usa la porta 80)
sudo certbot certonly --standalone -d roberto-ingenito.ddns.net --email robe.ingenito@gmail.com --agree-tos --no-eff-email

# Copia i certificati nella cartella che nginx si aspetta
sudo cp -r /etc/letsencrypt/live nginx/certbot/conf/
sudo cp -r /etc/letsencrypt/archive nginx/certbot/conf/
sudo cp -r /etc/letsencrypt/renewal nginx/certbot/conf/

# Correggi i permessi
sudo chown -R $USER:$USER nginx/certbot/conf
sudo chmod -R 755 nginx/certbot/conf

# Avvia i servizi
docker compose up -d

echo "✅ Certificati generati e configurati!"
echo "I certificati si rinnoveranno automaticamente tramite il container certbot"