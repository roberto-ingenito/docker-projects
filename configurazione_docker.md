## Setup Docker su RAID

### 1. Installa Docker

```bash
# Aggiorna sistema
sudo apt update
sudo apt upgrade -y

# Installa Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Aggiungi utente al gruppo docker
sudo usermod -aG docker ingenitor

# Ricarica gruppi (o fai logout/login)
newgrp docker

# Verifica installazione
docker --version
docker compose version
```

### 2. Ferma Docker (se già avviato)

```bash
sudo systemctl stop docker
sudo systemctl stop docker.socket
```

### 3. Crea la struttura directory sul RAID

```bash
# Crea directory Docker sul RAID
sudo mkdir -p /mnt/storage/docker/{data,volumes,containers}

# Imposta permessi corretti
sudo chown -R root:root /mnt/storage/docker
sudo chmod 755 /mnt/storage/docker
```

### 4. Configura Docker per usare il RAID

```bash
# Crea/modifica la configurazione daemon
sudo tee /etc/docker/daemon.json > /dev/null <<'EOF'
{
  "data-root": "/mnt/storage/docker/data",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

# Verifica il contenuto
cat /etc/docker/daemon.json
```

### 5. Migra i dati esistenti (se esistono)

```bash
# Se Docker ha già dati su /var/lib/docker
if [ -d /var/lib/docker ]; then
  sudo rsync -av /var/lib/docker/ /mnt/storage/docker/data/
fi
```

### 6. Riavvia Docker

```bash
sudo systemctl start docker

# Verifica che usi la nuova posizione
sudo docker info | grep "Docker Root Dir"
# Dovrebbe mostrare: /mnt/storage/docker/data
```

## Organizza il progetto sul RAID

### 1. Crea struttura per i progetti

```bash
# Struttura organizzata
mkdir -p /mnt/storage/projects
cd /mnt/storage/projects

# Copia/clona i tuoi progetti qui
# (se sono già da qualche parte, spostali qui)
```

### 2. Sposta il tuo docker-compose.yml

```bash
# Assumendo che il progetto sia in ~/progetto
# Spostalo sul RAID
cd /mnt/storage/projects
# Clona o copia qui il tuo progetto
```

### 3. Modifica docker-compose.yml per i volumi persistenti

Il tuo volume `postgres_data` sarà automaticamente su RAID perché Docker ora usa `/mnt/storage/docker/data`.

Ma per maggiore controllo, puoi specificare percorsi espliciti:

```yaml
volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/storage/docker/volumes/cashly-postgres

  # Se vuoi aggiungere altri volumi espliciti:
  nginx_certs:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/storage/docker/volumes/nginx-certs
```

E crea le directory:

```bash
sudo mkdir -p /mnt/storage/docker/volumes/cashly-postgres
sudo mkdir -p /mnt/storage/docker/volumes/nginx-certs
```

## Avvia i container

### 1. Vai nella directory del progetto

```bash
cd /mnt/storage/projects/tuo-progetto
```

### 2. Crea il file .env (se serve)

```bash
nano .env
```

Inserisci:

```env
POSTGRES_USER=cashly
POSTGRES_PASSWORD=TUA_PASSWORD_SICURA
POSTGRES_DB=cashly_db
```

### 3. Avvia tutto

```bash
# Build e avvio
docker compose up -d --build

# Verifica che tutto sia partito
docker compose ps

# Controlla i log
docker compose logs -f
```

## Verifica che tutto sia sul RAID

### 1. Controlla dove sono i dati

```bash
# Dimensione occupata da Docker
sudo du -sh /mnt/storage/docker/

# Lista volumi
docker volume ls

# Dettagli volumi
docker volume inspect cashly-db_postgres_data

# Dovresti vedere "Mountpoint": "/mnt/storage/docker/..."
```

### 2. Verifica performance

```bash
# Test scrittura nel container postgres
docker exec cashly-database sh -c "dd if=/dev/zero of=/tmp/test bs=1M count=100 conv=fdatasync"

# Dovresti vedere velocità NVMe (~200-500 MB/s)
```

### 3. Controlla spazio

```bash
df -h /mnt/storage
docker system df
```

## Backup Strategy

### Script di backup automatico

```bash
cat > /mnt/storage/scripts/backup-docker.sh <<'EOF'
#!/bin/bash
BACKUP_DIR="/mnt/storage/backups/docker"
DATE=$(date +%Y%m%d_%H%M%S)

echo "=== Docker Backup $DATE ==="

# Crea directory backup
mkdir -p "$BACKUP_DIR"

# Backup database Postgres
docker exec cashly-database pg_dump -U cashly cashly_db | gzip > "$BACKUP_DIR/cashly_db_$DATE.sql.gz"

# Backup volumi Docker
sudo tar czf "$BACKUP_DIR/docker_volumes_$DATE.tar.gz" -C /mnt/storage/docker/volumes .

# Backup configurazioni
tar czf "$BACKUP_DIR/configs_$DATE.tar.gz" /mnt/storage/projects/

# Pulizia backup vecchi (mantieni ultimi 7 giorni)
find "$BACKUP_DIR" -type f -mtime +7 -delete

echo "✓ Backup completato in $BACKUP_DIR"
EOF

chmod +x /mnt/storage/scripts/backup-docker.sh
```

### Aggiungi a cron

```bash
# Backup automatico ogni giorno alle 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /mnt/storage/scripts/backup-docker.sh >> /var/log/docker-backup.log 2>&1") | crontab -
```

## Struttura finale raccomandata

```
/mnt/storage/
├── docker/
│   ├── data/              # Docker root (immagini, container)
│   └── volumes/           # Volumi espliciti
│       ├── cashly-postgres/
│       └── nginx-certs/
├── projects/
│   ├── cashly/
│   │   ├── back-end/
│   │   ├── front-end/
│   │   ├── docker-compose.yml
│   │   └── .env
│   ├── fortil-excel-timesheet/
│   ├── prompt-builder/
│   └── nginx/
├── backups/
│   └── docker/
└── scripts/
    └── backup-docker.sh
```

## Comandi utili

### Gestione container

```bash
# Start/stop tutto
docker compose up -d
docker compose down

# Rebuild un singolo servizio
docker compose up -d --build cashly-back-end

# Log specifico servizio
docker compose logs -f cashly-back-end

# Entra in un container
docker exec -it cashly-database psql -U cashly -d cashly_db
```

### Pulizia

```bash
# Rimuovi immagini inutilizzate
docker image prune -a

# Rimuovi volumi non usati
docker volume prune

# Pulizia completa
docker system prune -a --volumes
```

### Monitoraggio

```bash
# Statistiche real-time
docker stats

# Spazio occupato
docker system df -v

# Health check
docker compose ps
```

## Verifica sicurezza RAID + Docker

```bash
# Test: Simula guasto durante scrittura Docker
# 1. Avvia un container che scrive dati
docker run -d --name test-write -v test_vol:/data alpine sh -c "while true; do echo $(date) >> /data/test.log; sleep 1; done"

# 2. Simula guasto disco
sudo mdadm /dev/md127 --fail /dev/nvme0n1p1

# 3. Verifica che Docker continui a funzionare
docker logs test-write --tail 10

# 4. Cleanup
docker stop test-write
docker rm test-write
docker volume rm test_vol

# 5. Ripristina RAID
sudo mdadm /dev/md127 --remove /dev/nvme0n1p1
sudo mdadm /dev/md127 --add /dev/nvme0n1p1
```

## Riassunto comandi veloci

```bash
# Setup iniziale (PRIMA del compose up)
sudo systemctl stop docker
sudo mkdir -p /mnt/storage/docker/{data,volumes,containers}
sudo tee /etc/docker/daemon.json > /dev/null <<'EOF'
{"data-root": "/mnt/storage/docker/data"}
EOF
sudo systemctl start docker

# Verifica
docker info | grep "Docker Root Dir"

# Avvia progetto
cd /mnt/storage/projects/tuo-progetto
docker compose up -d --build

# Backup
/mnt/storage/scripts/backup-docker.sh
```

**Tutto sul RAID protetto! 🎉**

Vuoi che ti aiuti a:

1. Ottimizzare il docker-compose.yml per il RAID?
2. Configurare monitoring per Docker + RAID insieme?
3. Setup CI/CD per deploy automatici?
