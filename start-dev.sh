#! /usr/bin/env bash

docker_compose_cmd="docker compose -f docker-compose-dev.yml -f docker-compose.yml"

# Check if docker is running and start it if not
docker ps > /dev/null 2>&1 || sudo systemctl start docker

# Function to run on Ctrl+C (SIGINT)
cleanup() {
    # Stop containers
    $docker_compose_cmd down
    exit 0
}

# Trap Ctrl+C to run cleanup function
trap cleanup INT

# Start containers
if [ "$1" = "-b" ]; then
    $docker_compose_cmd up --build --watch
else
    $docker_compose_cmd up --watch
fi
