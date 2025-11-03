#!/bin/bash
set -e

# Carica le variabili dal file .env se esiste
if [ -f .env ]; then
    echo "📄 Caricamento variabili da .env..."
    export $(grep -v '^#' .env | xargs)
else
    echo "⚠️  File .env non trovato"
fi

echo "🔄 Generazione GitHub Runner Registration Token..."

# Verifica che il PAT sia impostato
if [ -z "$GITHUB_PAT" ]; then
    echo "❌ Errore: GITHUB_PAT non impostato"
    echo "Crea un file .env con: GITHUB_PAT=ghp_your_token"
    exit 1
fi

# Genera il registration token
RUNNER_TOKEN=$(curl -s -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GITHUB_PAT}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/roberto-ingenito/docker-projects/actions/runners/registration-token \
  | jq -r '.token')

# Verifica che il token sia stato generato
if [ -z "$RUNNER_TOKEN" ] || [ "$RUNNER_TOKEN" = "null" ]; then
    echo "❌ Errore nella generazione del token"
    echo "Risposta API: $RUNNER_TOKEN"
    exit 1
fi

echo "✅ Token generato con successo"

# Esporta il token per docker compose
export RUNNER_TOKEN

# Ferma e rimuovi eventuali container esistenti
echo "🛑 Fermando container esistenti..."
docker compose down

# Avvia il runner
echo "🚀 Avviando GitHub Runner..."
docker compose up -d

echo "✅ Runner avviato! Controlla con: docker logs -f github-runner"