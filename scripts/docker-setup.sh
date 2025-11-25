#!/bin/bash

# Docker Development Environment Setup Script
# This script helps set up and manage the Docker development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop first."
        echo "Visit: https://www.docker.com/products/docker-desktop"
        exit 1
    fi
    print_success "Docker is installed"
}

# Check if Docker Compose is available
check_docker_compose() {
    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not available"
        exit 1
    fi
    print_success "Docker Compose is available"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f .env ]; then
        print_info "No .env file found. Creating from .env.example..."
        cp .env.example .env
        print_success "Created .env file from template"
        print_info "Please edit .env and add your credentials before starting services"
        echo ""
        echo "Required variables:"
        echo "  - GOOGLE_CLIENT_ID"
        echo "  - GOOGLE_CLIENT_SECRET"
        echo "  - OPENROUTER_API_KEY"
        echo ""
        read -p "Press Enter to continue after updating .env..."
    else
        print_success ".env file exists"
    fi
}

# Start Docker services
start_services() {
    print_info "Starting Docker services..."
    docker compose up -d
    print_success "Services started"

    echo ""
    print_info "Service URLs:"
    echo "  Frontend:  http://localhost:5173"
    echo "  Backend:   http://localhost:3000"
    echo "  Health:    http://localhost:3000/health"
    echo "  Adminer:   http://localhost:8080"
    echo "  Redis UI:  http://localhost:8081"
    echo ""
}

# Stop Docker services
stop_services() {
    print_info "Stopping Docker services..."
    docker compose down
    print_success "Services stopped"
}

# View logs
view_logs() {
    docker compose logs -f
}

# Reset everything (⚠️ destroys data)
reset_all() {
    print_error "WARNING: This will destroy all data in the database!"
    read -p "Are you sure? (yes/no): " confirm

    if [ "$confirm" == "yes" ]; then
        print_info "Stopping and removing all containers, networks, and volumes..."
        docker compose down -v
        print_success "Everything reset"
    else
        print_info "Reset cancelled"
    fi
}

# Show help
show_help() {
    echo "Docker Development Environment Manager"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  setup     - Initial setup (check dependencies, create .env)"
    echo "  start     - Start all services"
    echo "  stop      - Stop all services"
    echo "  restart   - Restart all services"
    echo "  logs      - View service logs"
    echo "  reset     - Reset everything (⚠️ destroys data)"
    echo "  status    - Show service status"
    echo "  help      - Show this help message"
    echo ""
}

# Show service status
show_status() {
    docker compose ps
}

# Main script logic
case "$1" in
    setup)
        print_info "Setting up Docker development environment..."
        check_docker
        check_docker_compose
        check_env_file
        print_success "Setup complete!"
        echo ""
        print_info "Next steps:"
        echo "  1. Edit .env with your credentials"
        echo "  2. Run: $0 start"
        ;;
    start)
        check_docker
        check_docker_compose
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        start_services
        ;;
    logs)
        view_logs
        ;;
    reset)
        reset_all
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        if [ -z "$1" ]; then
            show_help
        else
            print_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
        fi
        ;;
esac
