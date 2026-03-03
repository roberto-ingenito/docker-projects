# 🛡️ Nginx Reverse Proxy Gateway

Questa directory contiene la configurazione del **Reverse Proxy Nginx**, che funge da unico punto di ingresso (Gateway) per l'intera infrastruttura self-hosted. Gestisce il routing del traffico verso i vari container Docker, la terminazione SSL/TLS e l'ottimizzazione delle intestazioni HTTP.

## ⚙️ Struttura della Configurazione

La configurazione è modulare per facilitare la manutenzione e la sicurezza.

### 1. `default.conf` (Routing Principale)

Definisce i "Server Blocks" e le regole di instradamento del traffico.

- **Redirect HTTP -> HTTPS:** Forza tutto il traffico sulla porta sicura 443.
- **Gestione Certbot:** Espone la route `/.well-known/acme-challenge/` per il rinnovo automatico dei certificati Let's Encrypt.
- **Path-Based Routing:** Smista il traffico ai container corretti in base all'URL richiesto.

### 2. `ssl_params.conf` (Sicurezza SSL)

File incluso centralmente per applicare le best practice di sicurezza:

- **Certificati:** Punta ai certificati Let's Encrypt montati via volume (`/etc/letsencrypt/live/...`).
- **Protocolli:** Abilita solo TLSv1.2 e TLSv1.3.
- **Security Headers:**
  - `Strict-Transport-Security` (HSTS): Forza i browser a usare sempre HTTPS.
  - `X-Frame-Options`: Previene attacchi di Clickjacking.
  - `X-Content-Type-Options`: Previene sniffing del MIME type.

### 3. `proxy_params.conf` (Header Proxy)

Definisce le intestazioni standard da passare ai servizi di backend per preservare le informazioni del client originale:

- Passa `Host`, `X-Real-IP`, `X-Forwarded-For`.
- Supporta connessioni WebSocket (`Upgrade` e `Connection`).
- Forza `X-Forwarded-Proto https` per informare le app downstream che la connessione è sicura.

## 🔀 Mappa del Routing (Path-Based)

Il dominio principale è `roberto-ingenito.ddns.net`. Nginx indirizza le richieste come segue:

| Path URL          | Servizio Destinazione | Container:Porta                   | Note                                                                              |
| :---------------- | :-------------------- | :-------------------------------- | :-------------------------------------------------------------------------------- |
| **`/`**           | Redirect              | -> `/cashly/`                     | Redirect automatico alla dashboard principale.                                    |
| **`/api/`**       | Backend API           | `cashly-back-end:80`              | API principale .NET                                                               |
| **`/swagger`**    | Documentazione API    | `cashly-back-end:80`              | Swagger UI.                                                                       |
| **`/cashly/`**    | Cashly Frontend       | `cashly-front-end:3000`           | App Next.js principale. Include ottimizzazioni per cache assets e Service Worker. |
| **`/timesheet/`** | Fortil Timesheet      | `fortil-excel-timesheet-app:3000` | SPA React (Vite).                                                                 |

## 🚀 Integrazione Next.js (Cashly)

La configurazione per `/cashly/` include regole specifiche per il corretto funzionamento di Next.js dietro un reverse proxy in una sottocartella:

- **Service Worker (`sw.js`):** Servito con header `Cache-Control: no-cache` per garantire che gli aggiornamenti dell'app vengano rilevati immediatamente.
- **Static Assets (`_next/static/`):** Serviti con policy di caching aggressiva (`immutable`, `365d`) per massimizzare le performance.

## 🔐 Gestione Certificati (Certbot)

Nginx lavora in tandem con il container `certbot` definito nel `docker-compose.yml`.

- I certificati sono condivisi tramite volumi Docker.
- Il container Certbot rinnova i certificati periodicamente e Nginx li ricarica (richiede reload o restart se il file cambia, gestito tipicamente da script o riavvio container).
