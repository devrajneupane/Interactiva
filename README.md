# Interactiva

Interact with LLMs supported by Ollama in real-time, create and share models, and manage their chats, all with multi-user support

## Installation

1. Clone the repository:

   ```bash
   git https://github.com/devrajneupane/Interactiva
   cd Interactiva
   ```

1. Create a `.env` file with the help of `.env.example`

## Run using docker

1. For deployment

   ```bash
   docker compose up
   ```

1. For development
   A startup script `start-dev.sh` is provided for dev containers with support of `docker watch`
   ```bash
      ./start-dev.sh
   ```
   Use with `-b` flag to build images before starting dev containers
   ```bash
      ./start-dev.sh -b
   ```
