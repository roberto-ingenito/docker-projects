#!/bin/bash

# CloudBeaver Container Utility Script
# Gestione del container CloudBeaver

CONTAINER_NAME="cloudbeaver"
IMAGE="dbeaver/cloudbeaver:latest"
HOST_IP="192.168.1.20"
PORT="8978"
WORKSPACE_PATH="/var/cloudbeaver/workspace"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzione per stampare messaggi colorati
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Funzione per verificare se il container esiste
container_exists() {
    docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"
}

# Funzione per verificare se il container è in esecuzione
container_running() {
    docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"
}

# Funzione per avviare il container
start_container() {
    echo "Avvio del container CloudBeaver..."
    
    if container_running; then
        print_warning "Il container è già in esecuzione"
        return 1
    fi
    
    if container_exists; then
        print_info "Container esistente trovato. Avvio in corso..."
        docker start "$CONTAINER_NAME"
    else
        print_info "Creazione e avvio del nuovo container..."
        # Verifica che la directory workspace esista
        if [ ! -d "$WORKSPACE_PATH" ]; then
            print_warning "La directory $WORKSPACE_PATH non esiste. Creazione in corso..."
            sudo mkdir -p "$WORKSPACE_PATH"
        fi
        
        docker run -d \
            --name "$CONTAINER_NAME" \
            --rm \
            -ti \
            -p "${HOST_IP}:${PORT}:${PORT}" \
            -v "${WORKSPACE_PATH}:/opt/cloudbeaver/workspace" \
            "$IMAGE"
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Container avviato con successo"
        print_info "CloudBeaver disponibile su: http://${HOST_IP}:${PORT}"
    else
        print_error "Errore durante l'avvio del container"
        return 1
    fi
}

# Funzione per fermare il container
stop_container() {
    echo "Arresto del container CloudBeaver..."
    
    if ! container_running; then
        print_warning "Il container non è in esecuzione"
        return 1
    fi
    
    docker stop "$CONTAINER_NAME"
    
    if [ $? -eq 0 ]; then
        print_success "Container arrestato con successo"
    else
        print_error "Errore durante l'arresto del container"
        return 1
    fi
}

# Funzione per riavviare il container
restart_container() {
    echo "Riavvio del container CloudBeaver..."
    stop_container
    sleep 2
    start_container
}

# Funzione per eliminare il container
remove_container() {
    echo "Rimozione del container CloudBeaver..."
    
    if ! container_exists; then
        print_warning "Il container non esiste"
        return 1
    fi
    
    # Richiesta di conferma
    read -p "Sei sicuro di voler eliminare il container? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        print_info "Operazione annullata"
        return 0
    fi
    
    # Se il container è in esecuzione, fermalo prima
    if container_running; then
        print_info "Arresto del container in esecuzione..."
        docker stop "$CONTAINER_NAME"
    fi
    
    # Il container con --rm si rimuove automaticamente, ma nel caso esista ancora
    if container_exists; then
        docker rm -f "$CONTAINER_NAME"
    fi
    
    # Chiedi se eliminare anche i dati del workspace
    read -p "Vuoi eliminare anche i dati del workspace in ${WORKSPACE_PATH}? (s/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        print_warning "Eliminazione dei dati del workspace..."
        sudo rm -rf "$WORKSPACE_PATH"
        print_success "Dati del workspace eliminati"
    fi
    
    print_success "Container rimosso completamente"
}

# Funzione per mostrare lo stato del container
status_container() {
    echo "=== Stato del Container CloudBeaver ==="
    echo
    
    if container_running; then
        print_success "Il container è IN ESECUZIONE"
        echo
        docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        echo
        print_info "URL: http://${HOST_IP}:${PORT}"
        echo
        
        # Mostra utilizzo risorse
        print_info "Utilizzo risorse:"
        docker stats "$CONTAINER_NAME" --no-stream --format "  CPU: {{.CPUPerc}}\t Memoria: {{.MemUsage}}"
    elif container_exists; then
        print_warning "Il container esiste ma NON è in esecuzione"
        docker ps -a --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}"
    else
        print_error "Il container NON esiste"
    fi
    
    echo
    print_info "Immagine utilizzata: $IMAGE"
    print_info "Workspace: $WORKSPACE_PATH"
}

# Funzione per mostrare i log
logs_container() {
    if ! container_exists; then
        print_error "Il container non esiste"
        return 1
    fi
    
    print_info "Ultimi log del container (premi Ctrl+C per uscire):"
    echo
    docker logs -f --tail 100 "$CONTAINER_NAME"
}

# Funzione per mostrare l'help
show_help() {
    cat << EOF
CloudBeaver Container Utility - Script di gestione

Uso: $(basename "$0") [COMANDO]

COMANDI DISPONIBILI:
    start       Avvia il container CloudBeaver
    stop        Ferma il container CloudBeaver
    restart     Riavvia il container CloudBeaver
    remove      Rimuove completamente il container (con conferma)
    status      Mostra lo stato del container
    logs        Mostra i log del container
    help        Mostra questo messaggio di aiuto

ESEMPI:
    $(basename "$0") start
    $(basename "$0") status
    $(basename "$0") remove

CONFIGURAZIONE:
    Container:  $CONTAINER_NAME
    Immagine:   $IMAGE
    Host:       $HOST_IP:$PORT
    Workspace:  $WORKSPACE_PATH

EOF
}

# Main script
main() {
    # Verifica che Docker sia installato
    if ! command -v docker &> /dev/null; then
        print_error "Docker non è installato o non è nel PATH"
        exit 1
    fi
    
    # Verifica argomenti
    if [ $# -eq 0 ]; then
        show_help
        exit 0
    fi
    
    # Gestione comandi
    case "$1" in
        start)
            start_container
            ;;
        stop)
            stop_container
            ;;
        restart)
            restart_container
            ;;
        remove|rm)
            remove_container
            ;;
        status)
            status_container
            ;;
        logs)
            logs_container
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Comando sconosciuto: $1"
            echo
            show_help
            exit 1
            ;;
    esac
}

main "$@"
