# Infrastructure

Documentation on any Infrastructure setup or changes made.

# Dockerfile

- This Dockerfile sets up a Node.js app using PNPM. It first prepares a base image with Node.js and PNPM, then installs dependencies in a separate stage to keep things organized. The final image only includes what’s needed, exposing port 3000 and running the app securely as a non-root user. It also includes a health check to ensure the app is running smoothly and starts the server using pnpm dev.

# Docker compose

- This docker-compose.yml file defines a single app service that builds a Node.js application using a Dockerfile located in ./infra/app. It sets the build context to the parent directory and exposes the app on port 3000, allowing it to be accessed via http://localhost:3000.

## Folder structure

- `infra/app/Dockerfile` - Dockerfile to build the app
- `infra/docker-compose.yaml` - Docker compose file to orchestrate the build and local run
- `.dockerignore` - Docker ignore files to build.
