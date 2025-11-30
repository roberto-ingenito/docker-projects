# 🏠 Docker Projects - Hub Self-Hosting

Questo repository è il cuore dell'infrastruttura di self-hosting gestita su **Raspberry Pi**. Raggruppa diversi progetti e servizi containerizzati, orchestrati via **Docker Compose** e gestiti tramite una pipeline CI/CD automatizzata.

## 🌟 Panoramica dei Servizi

L'accesso ai servizi è gestito centralmente da Nginx.

| Servizio | URL Path | Descrizione | Stack Tecnologico | Documentazione |
| :--- | :--- | :--- | :--- | :--- |
| **Cashly** | `/cashly/` | Gestione finanze personali (App, API, DB). | Next.js, .NET 9, PostgreSQL | [Vedi Dettagli](./cashly/README.md) |
| **Prompt Builder** | `/prompt-builder/` | Tool per la creazione di prompt AI. | Next.js | [Vedi Dettagli](./prompt-builder/README.md) |
| **Timesheet** | `/timesheet/` | Utility per fogli orari Excel. | React (Vite) | [Vedi Dettagli](./fortil-excel-timesheet/README.md) |
| **Backend API** | `/api/` | Gateway API condiviso. | .NET 9 | [Vedi Dettagli](./cashly/README.md) |

## ⚙️ Architettura

* **Host:** Raspberry Pi (Ubuntu Server / Raspberry Pi OS).
* **Gateway:** Nginx Reverse Proxy con terminazione SSL (Let's Encrypt/Certbot).
* **Orchestrazione:** Docker Compose (rete `common-network`).
* **Deployment:** GitHub Actions Self-Hosted Runner (CD automatico su push).