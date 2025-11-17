# Infrastructure

This directory contains the infrastructure setup for the application.

## Main Application Docker Setup

The main application Docker configuration is located in this directory:

- **`Dockerfile`** - Multi-stage Dockerfile for building and running the Next.js application
- **`docker-compose.yml`** - Docker Compose configuration for orchestrating the application

### Quick Start

From the project root, run:

```bash
# Build and start the application
docker-compose -f infra/docker-compose.yml up --build

# Run in detached mode
docker-compose -f infra/docker-compose.yml up -d

# Stop the application
docker-compose -f infra/docker-compose.yml down
```

For detailed documentation, see [Docker Setup Documentation](../docs/devops/docker-setup.md).

## Additional Infrastructure Components

To add additional infrastructure components (databases, caches, etc.):

1. Create a new subdirectory (e.g., `infra/database/`)
2. Add your Dockerfile or docker-compose.yml
3. Document your setup in the `/docs/infrastructure/` directory
