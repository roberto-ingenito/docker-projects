accedi con ssh al raspberry

# Fase 1: Preparazione e Backup dei Dati Docker

### Backup dei dati docker

```sh
sudo -i
cd /home/ingenitor/docker-projects/
docker compose down

# Identifica il percorso del volume postgres
VOL_PATH=$(docker volume inspect cashly-db_postgres_data --format '{{.Mountpoint}}')

# Crea una cartella di backup
mkdir -p /root/backup_migration

# Backup del database
tar -czf /root/backup_migration/postgres_data.tar.gz -C $VOL_PATH .
```

# Fase 2: configurazione sistema operativo

### Pulisci i dischi (questo cancellerà tutte le partizioni)

```sh
sudo sgdisk --zap-all /dev/nvme0n1
sudo sgdisk --zap-all /dev/nvme1n1
```

### Scarica l'immagine di ubuntu server per arm

```sh
# Installa le utility necessarie
apt update && apt install xz-utils curl -y

# Scarica e flasha l'immagine Ubuntu Server 24.04 LTS (Preinstalled per Raspberry Pi)
mkdir -p ~/nvme_setup && cd ~/nvme_setup
curl -L https://cdimage.ubuntu.com/releases/24.04/release/ubuntu-24.04.3-preinstalled-server-arm64+raspi.img.xz | xz -d | dd of=/dev/nvme0n1 bs=4M status=progress
sync
```

### Crea i punti di mount e monta le partizioni del nuovo disco

```sh
mkdir -p /mnt/nvme_boot /mnt/nvme_root
mount /dev/nvme0n1p1 /mnt/nvme_boot
mount /dev/nvme0n1p2 /mnt/nvme_root
```

### Configura l'IP Statico

```sh
cat <<EOF > /mnt/nvme_root/etc/netplan/50-cloud-init.yaml
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: false
      addresses:
        - 192.168.1.20/24   # Indirizzo IP statico del tuo Raspberry Pi
      routes:
        - to: default
          via: 192.168.1.1   # Gateway del router (ad esempio, indirizzo IP del tuo router Vodafone)
      nameservers:
        addresses:
          - 1.1.1.1         # DNS di Cloudflare
          - 8.8.8.8         # DNS di Google
EOF

cat <<EOF > /mnt/nvme_boot/network-config
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: false
      addresses:
        - 192.168.1.20/24   # Indirizzo IP statico del tuo Raspberry Pi
      routes:
        - to: default
          via: 192.168.1.1   # Gateway del router (ad esempio, indirizzo IP del tuo router Vodafone)
      nameservers:
        addresses:
          - 1.1.1.1         # DNS di Cloudflare
          - 8.8.8.8         # DNS di Google
EOF
```

### Configurazione SSH

1. Entra nell'ambiente chroot:
   ```sh
   chroot /mnt/nvme_root /bin/bash
   ```
   - Modifica `50-cloud-init.conf`
     ```sh
     nano /etc/ssh/sshd_config.d/50-cloud-init.conf
     ```
     Imposta `PasswordAuthentication` a `yes`
   - Crea un nuovo utente
     ```sh
     adduser ingenitor
     ```
   - Imposta l'utente come amministratore
     ```sh
     sudo usermod -aG sudo ingenitor
     ```
1. Esci da _chroot_ con `exit`
1. Smonta
   ```sh
   cd /
   umount /mnt/nvme_boot
   umount /mnt/nvme_root
   ```

### Configurazione bootloader

1. Controlla eventuali aggiornamenti
   ```sh
   sudo rpi-eeprom-update
   ```
1. Modifica boot order
   1. Dai il comando per la modifica
      ```sh
      sudo rpi-eeprom-config --edit
      ```
   1. Cerca la riga `BOOT_ORDER=` e modifica il suo valore in `0xf146`
   1. Salva, esci e aspetta che finisca di eseguire.
