#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

show_help() {
    cat << EOF
Database Workflow Management Script

Usage: $0 [COMMAND] [OPTIONS]

Commands:
    setup           Set up databases (start containers, run migrations)
    start           Start PostgreSQL container
    stop            Stop PostgreSQL container
    reset           Reset databases (drop and recreate)

    shared:generate Generate shared schema migrations
    shared:migrate  Run shared schema migrations
    shared:studio   Open shared schema studio

    teamd:generate  Generate Team D overlay migrations
    teamd:migrate   Run Team D overlay migrations
    teamd:studio    Open Team D schema studio
    teamd:promote   Promote Team D schema to shared

Options:
    -h, --help      Show this help message
    -v, --verbose   Verbose output

Examples:
    $0 setup                    # Full database setup
    $0 shared:generate          # Generate shared migrations
    $0 teamd:promote           # Promote Team D changes to shared
EOF
}

log() {
    echo "🔧 [$(date '+%H:%M:%S')] $*"
}

error() {
    echo "❌ [$(date '+%H:%M:%S')] ERROR: $*" >&2
}

check_docker() {
    if ! command -v docker >/dev/null 2>&1; then
        error "Docker is required but not installed"
        exit 1
    fi

    if ! docker info >/dev/null 2>&1; then
        error "Docker daemon is not running"
        exit 1
    fi
}

check_pnpm() {
    if ! command -v pnpm >/dev/null 2>&1; then
        error "pnpm is required but not installed"
        exit 1
    fi
}

start_postgres() {
    log "Starting PostgreSQL container..."
    cd "$ROOT_DIR"
    docker-compose up -d postgres

    log "Waiting for PostgreSQL to be ready..."
    sleep 5

    # Wait for PostgreSQL to accept connections
    for i in {1..30}; do
        if docker-compose exec postgres pg_isready -U user >/dev/null 2>&1; then
            log "PostgreSQL is ready!"
            return 0
        fi
        echo -n "."
        sleep 1
    done

    error "PostgreSQL failed to start after 30 seconds"
    return 1
}

stop_postgres() {
    log "Stopping PostgreSQL container..."
    cd "$ROOT_DIR"
    docker-compose stop postgres
}

setup_databases() {
    log "Setting up databases..."
    check_docker
    check_pnpm

    start_postgres

    log "Installing dependencies..."
    cd "$ROOT_DIR"
    pnpm install

    log "Running shared database migrations..."
    pnpm db:migrate

    log "Building shared database..."
    pnpm --filter @large-event/database build

    log "Installing Team D database dependencies..."
    pnpm --filter @teamd/database install

    log "Running Team D migrations..."
    pnpm teamd:db:migrate

    log "Database setup completed successfully! 🎉"
}

reset_databases() {
    log "Resetting databases..."
    check_docker

    cd "$ROOT_DIR"
    docker-compose down -v postgres
    docker-compose up -d postgres

    setup_databases
}

case "${1:-}" in
    setup)
        setup_databases
        ;;
    start)
        start_postgres
        ;;
    stop)
        stop_postgres
        ;;
    reset)
        reset_databases
        ;;
    shared:generate)
        log "Generating shared schema migrations..."
        cd "$ROOT_DIR"
        pnpm db:generate
        ;;
    shared:migrate)
        log "Running shared schema migrations..."
        cd "$ROOT_DIR"
        pnpm db:migrate
        ;;
    shared:studio)
        log "Opening shared schema studio..."
        cd "$ROOT_DIR"
        pnpm db:studio
        ;;
    teamd:generate)
        log "Generating Team D overlay migrations..."
        cd "$ROOT_DIR"
        pnpm teamd:db:generate
        ;;
    teamd:migrate)
        log "Running Team D overlay migrations..."
        cd "$ROOT_DIR"
        pnpm teamd:db:migrate
        ;;
    teamd:studio)
        log "Opening Team D schema studio..."
        cd "$ROOT_DIR"
        pnpm teamd:db:studio
        ;;
    teamd:promote)
        log "Promoting Team D schema to shared..."
        cd "$ROOT_DIR"
        pnpm teamd:db:promote
        ;;
    -h|--help)
        show_help
        ;;
    *)
        error "Unknown command: ${1:-}"
        echo ""
        show_help
        exit 1
        ;;
esac