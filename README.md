# 🏠 Docker Projects - Hub Self-Hosting

Questo repository è il cuore dell'infrastruttura di self-hosting gestita su **Raspberry Pi**. Raggruppa diversi progetti e servizi containerizzati, orchestrati via **Docker Compose** e gestiti tramite una pipeline CI/CD automatizzata.

## 🌟 Panoramica dei Servizi

L'accesso ai servizi è gestito centralmente da Nginx.

| Servizio | URL Path | Descrizione |
| :--- | :--- | :--- |
| **Cashly** | `/cashly/` | Gestione finanze personali (App, API, DB). | 
| **Prompt Builder** | `/prompt-builder/` | Tool per la creazione di prompt AI. | 
| **Timesheet** | `/timesheet/` | Utility per fogli orari Excel. |
| **Backend API** | `/api/` | Gateway API condiviso. | 
## ⚙️ Architettura

* **Host:** Raspberry Pi (Ubuntu Server / Raspberry Pi OS).
* **Gateway:** Nginx Reverse Proxy con terminazione SSL (Let's Encrypt/Certbot).
* **Orchestrazione:** Docker Compose (rete `common-network`).
* **Deployment:** GitHub Actions Self-Hosted Runner (CD automatico su push).
