# 🚀 Docker Projects Hub

Questo repository contiene una collezione di applicazioni e servizi self-hosted, orchestrati tramite Docker e configurati per essere eseguiti su un server domestico (es. Raspberry Pi o Ubuntu Server).

## 🏗️ Architettura del Sistema

L'infrastruttura è progettata per essere modulare e sicura, utilizzando un reverse proxy centralizzato per la gestione del traffico e dei certificati SSL.

### Componenti Principali:

- **Reverse Proxy**: Nginx (Alpine) gestisce il routing del traffico HTTP/HTTPS.
- **SSL**: Certbot per il rilascio e rinnovo automatico dei certificati Let's Encrypt.
- **Database**: PostgreSQL (per le app principali) e CouchDB (per Obsidian).
- **CI/CD**: GitHub Actions con Self-Hosted Runner per il deployment automatico.

---

## 📱 Applicazioni Incluse

### 💰 Cashly

Un'applicazione completa per la gestione delle finanze personali.

- **Backend**: .NET Core Web API.
- **Frontend**: Next.js (React).
- **Database**: PostgreSQL.

### 🎮 Mr. White Game

Un gioco interattivo basato su ruoli e parole segrete.

- **Backend**: .NET Core con SignalR per il tempo reale.
- **Frontend**: Next.js.

### 📂 Nextcloud

Suite completa per il cloud storage e la collaborazione.

- **Stack**: PHP/Apache, PostgreSQL, Redis (caching).
- **Storage**: Configurato per utilizzare un'unità RAID esterna.

### 📝 Altri Strumenti

- **Fortil Excel Timesheet**: Tool per la gestione dei fogli ore (Vite/React).
- **CouchDB**: Database dedicato alla sincronizzazione di Obsidian (LiveSync).
- **Calcolatori Statici**: Piccole utility HTML/JS per finanze e tasse.
- **pgAdmin**: Interfaccia web per la gestione dei database PostgreSQL.

---

## ⚙️ Configurazione e Installazione

### 1. Prerequisiti

- Docker e Docker Compose installati.
- Un nome di dominio (es. configurato tramite DDNS su NO-IP).
- Porta 80 e 443 aperte sul router.

### 2. Setup Ambiente

Copia il file `.env-template` in `.env` e compila le variabili necessarie:

```bash
cp .env-template .env
nano .env
```

### 3. Avvio dei Servizi

Per avviare l'intera infrastruttura in modalità detached:

```bash
docker compose up -d
```

### 4. Generazione Certificati SSL

Se è la prima installazione, esegui lo script per generare i certificati:

```bash
chmod +x generate-certificate.sh
./generate-certificate.sh
```

---

## 📄 Documentazione Correlata

Per approfondimenti su configurazioni specifiche, consulta i seguenti documenti:

- [🛠️ Infrastructure & Host Setup](INFRASTRUCTURE.md): Configurazione IP statico, DDNS e Runner GitHub.
- [🐳 Configurazione Docker per il RAID](configurazione_docker.md): Dettagli sulla struttura dei container.
- [💾 Backup & Restore Postgres](backup_and_restore_postgres.md): Procedure per la messa in sicurezza dei dati.
- [🗄️ Configurazione RAID](configurazione_raid.md): Setup del disco esterno per Nextcloud.
- [📝 Obsidian Sync](configurazione_obsidian_sync.md): Guida al setup di CouchDB per Obsidian.

---

## 🛠️ Comandi Utili

- **Vedere i log di un servizio**: `docker compose logs -f [service-name]`
- **Riavviare Nginx**: `docker compose restart main-nginx`
- **Verificare lo stato dei container**: `docker ps`
