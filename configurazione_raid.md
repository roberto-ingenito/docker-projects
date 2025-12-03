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
   1. Cerca la riga `BOOT_ORDER=` e modifica il suo valore in `0xf641`
   1. Salva, esci e aspetta che finisca di eseguire.

### Avvia il sistema

1. Spegni il raspberry
1. Scollega il vecchio disco
1. Accendi il raspberry
1. Accedi con ssh all'utente precedentemente creato
1. Aggiorna il sistema
   ```sh
   sudo apt update && sudo apt upgrade
   ```

### INFO: ⚙️ Ordine di Avvio (BOOT_ORDER) del Raspberry Pi

Il parametro **`BOOT_ORDER`** è una configurazione cruciale che risiede nell'**EEPROM** del bootloader del Raspberry Pi (tipicamente modelli Pi 4 e successivi).

Definisce la **sequenza esatta** con cui il Raspberry Pi tenta di caricare il sistema operativo da diverse periferiche.

#### 🔢 Decodifica del Valore Esadecimale

Il valore è una stringa esadecimale (es. `0xf146`). Il bootloader legge la sequenza di avvio da **destra a sinistra** (escludendo il prefisso `0x`), dove ogni cifra rappresenta un tentativo di avvio.

| Cifra Esadecimale | Modalità di Avvio | Descrizione                                                                             |
| :---------------: | :---------------: | :-------------------------------------------------------------------------------------- |
|       **1**       |    **SD CARD**    | Tenta l'avvio dalla scheda SD (o eMMC).                                                 |
|       **2**       |      **NET**      | Tenta l'avvio tramite Rete (Ethernet/PXE).                                              |
|       **4**       |    **USB-MSD**    | Tenta l'avvio da un dispositivo di archiviazione di massa USB (chiavetta, SSD esterno). |
|       **6**       |     **NVME**      | Tenta l'avvio da un'unità SSD NVMe (se supportata, come su Pi 5).                       |
|       **f**       |    **RESTART**    | Riavvia l'intera sequenza dall'inizio se tutti i tentativi precedenti falliscono.       |

Esempio: `BOOT_ORDER=0xf146`: Tenta l'avvio da NVME, poi da USB, poi da SD CARD. Altrimenti riavvia (f)

# Fase 3: Configurazione RAID 1

Spegni il raspberry e riaccendilo dalla chiavetta USB. Si devono modificare i due dischi e bisogna eseguire queste operazione dall'esterno.

### Installazione dei tool necessari

#### Entra in modalità superuser

```sh
sudo -i
```

#### Installa i tool necessari

```sh
apt update
apt install mdadm -y
```

### Replica la tabella delle partizioni

Copiamo la struttura da nvme0n1 (disco con dati) a nvme1n1 (disco vuoto).

```sh
sfdisk -d /dev/nvme0n1 | sfdisk /dev/nvme1n1
```

### Creazione del RAID "Degradato"

1. Crea l'array MD0: Usiamo la parola chiave missing per il primo disco, così l'array parte in modalità degradata con un solo disco.
   ```sh
   mdadm --create /dev/md0 --level=1 --raid-devices=2 missing /dev/nvme1n1p2
   ```
1. Formatta il nuovo volume RAID:
   ```sh
   mkfs.ext4 /dev/md0
   ```

### Migrazione dei Dati

Ora dobbiamo copiare tutto dal vecchio sistema al nuovo RAID.

1. Monta le partizioni:
   ```sh
   mkdir -p /mnt/source /mnt/target
   mount /dev/nvme0n1p2 /mnt/source  # Vecchio sistema
   mount /dev/md0 /mnt/target        # Nuovo RAID
   ```
1. Clona i dati (Root): Usiamo rsync per preservare permessi, link simbolici e attributi.
   ```sh
   rsync -axHAWXS --numeric-ids --info=progress2 /mnt/source/ /mnt/target/
   ```
1. Clona la partizione di Boot: Dobbiamo assicurarci che la partizione di boot del secondo disco sia identica alla prima.
   - Formatta PRIMA di montare (cruciale!)
     ```sh
     mkfs.vfat -F 32 /dev/nvme1n1p1
     ```
   - Crea le directory
     ```sh
     mkdir -p /mnt/boot_source /mnt/boot_target
     ```
   - Monta le partizioni
     ```sh
     mount /dev/nvme0n1p1 /mnt/boot_source
     ```
   - Monta le partizioni
     ```sh
     mount /dev/nvme1n1p1 /mnt/boot_target
     ```
   - Svuota il target per sicurezza
     ```sh
     rm -rf /mnt/boot_target/*
     ```
   - Copia i dati
     ```sh
     rsync -axHAWXS /mnt/boot_source/ /mnt/boot_target/
     ```

### Configurazione del Sistema (Chroot)

1. Montiamo la partizione di boot corretta dentro il raid e i filesystem di sistema.
   ```sh
   mount /dev/nvme1n1p1 /mnt/target/boot/firmware
   mount --bind /dev /mnt/target/dev
   mount --bind /proc /mnt/target/proc
   mount --bind /sys /mnt/target/sys
   ```
1. Entra nel nuovo sistema
   ```sh
   chroot /mnt/target
   ```
1. Configura mdadm dentro il sistema: Ora sei "dentro" l'installazione su RAID.
   ```sh
   # Genera il file di configurazione del raid
   mdadm --detail --scan >> /etc/mdadm/mdadm.conf
   ```
1. Aggiorna fstab: Modifica `/etc/fstab` per montare il device RAID invece del vecchio UUID. Trova l'UUID del raid con il comando `blkid /dev/md0`
   ```sh
   nano /etc/fstab
   ```
   **Sostituisci** l'intera riga che monta `/` con `UUID=xxxx-xxxx-xxxx    /    ext4    defaults,noatime    0    1`
   > NOTA BENE: la riga, non usa spazi bensì usa i tab
   > NOTA BENE: Non toccare la riga `/boot/firmware`
1. Salva ed esci da nano e dai il comando: Questo passaggio è fondamentale affinché il kernel carichi i moduli RAID all'avvio.
   ```sh
   update-initramfs -u
   ```
1. Modifica cmdline.txt: Il bootloader del Pi deve sapere dove trovare la root
   ```sh
   nano /boot/firmware/cmdline.txt
   ```
   - Trova la parte `root=...` e cambiala in: `root=UUID=uuid-del-tuo-md0`.
   - Assicurati anche che ci sia rootfstype=ext4.
1. Esci dal Chroot
   ```sh
   exit
   ```

### Avvio del sistema

1. Smonta tutto e spegni
   ```sh
   umount -R /mnt/target
   umount -R /mnt/source
   shutdown now
   ```
1. Rimuovi il disco temporaneo usato per fare la configurazione
1. Accendi il raspberry
