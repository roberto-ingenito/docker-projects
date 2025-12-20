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

### Crea struttura per i progetti

```bash
# Struttura organizzata
mkdir -p /mnt/storage/projects
cd /mnt/storage/projects

# Copia/clona i tuoi progetti qui
# (se sono già da qualche parte, spostali qui)
```

## Avvia i container

```bash
docker compose build
```

```bash
docker compose up -d nginx
```

```bash
./generate-certificate.sh
```

```bash
docker compose up -d
```
