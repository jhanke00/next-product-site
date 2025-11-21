# Docker Setup - Infrastructure Documentation

## Overview

This document describes the Docker containerization setup for the Next.js Product Site application. The Docker configuration allows for easy local development and deployment of the application.

## Files

### Dockerfile

**Location:** `/Dockerfile`

Multi-stage Docker build configuration:

1. **Base Stage**: Installs dependencies and builds the application
   - Uses Node.js 22 Alpine image
   - Installs pnpm 9
   - Copies package files and installs dependencies
   - Builds the Next.js application

2. **Runner Stage**: Production-ready image
   - Uses Node.js 22 Alpine image
   - Installs only production dependencies
   - Copies built application files
   - Exposes port 3000
   - Starts the application with `pnpm start`

### docker-compose.yml

**Location:** `/docker-compose.yml`

Docker Compose configuration for orchestrating the application:

- **Service**: `next-product-site`
- **Ports**: Maps container port 3000 to host port 3000
- **Environment**: Sets NODE_ENV to production
- **Volumes**: Mounts source directories (read-only) for development flexibility
- **Restart Policy**: Restarts unless stopped

### .dockerignore

**Location:** `/.dockerignore`

Specifies files and directories to exclude from the Docker build context:

- `node_modules`
- `.next` (build output)
- Git files
- Environment files
- Log files
- IDE configuration files

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Usage

### Building the Docker Image

```bash
# Build the image
docker build -t next-product-site .

# Or using docker-compose
docker-compose build
```

### Running with Docker

```bash
# Run the container
docker run -p 3000:3000 next-product-site

# Or using docker-compose
docker-compose up
```

### Running in Detached Mode

```bash
# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Development Mode

For development, you can mount volumes to enable hot-reloading:

```yaml
# Add to docker-compose.yml volumes section
volumes:
  - ./src:/app/src
  - ./app:/app/app
  - ./public:/app/public
  - ./node_modules:/app/node_modules
```

Then run:

```bash
docker-compose up
```

## Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
NODE_ENV=production
PORT=3000
```

The Docker Compose file will automatically load `.env` if present.

## Port Configuration

The application runs on port 3000 by default. To change the port:

1. Update `docker-compose.yml`:

   ```yaml
   ports:
     - '8080:3000' # Host:Container
   ```

2. Or set the PORT environment variable:
   ```yaml
   environment:
     - PORT=8080
   ```

## Troubleshooting

### Container won't start

1. Check if port 3000 is already in use:

   ```bash
   lsof -i :3000  # macOS/Linux
   netstat -ano | findstr :3000  # Windows
   ```

2. Check Docker logs:
   ```bash
   docker-compose logs
   ```

### Build fails

1. Ensure Docker has enough resources allocated (memory, CPU)
2. Clear Docker cache:
   ```bash
   docker system prune -a
   ```
3. Rebuild without cache:
   ```bash
   docker-compose build --no-cache
   ```

### Changes not reflecting

1. Rebuild the image after code changes:

   ```bash
   docker-compose up --build
   ```

2. For development, use volume mounts (see Development Mode above)

## Production Considerations

For production deployment:

1. **Security**:
   - Use non-root user in Dockerfile
   - Scan images for vulnerabilities
   - Use secrets management for sensitive data

2. **Performance**:
   - Use multi-stage builds (already implemented)
   - Optimize image size
   - Use .dockerignore effectively

3. **Monitoring**:
   - Add health checks
   - Set up logging
   - Monitor resource usage

4. **Scaling**:
   - Use orchestration tools (Kubernetes, Docker Swarm)
   - Implement load balancing
   - Use container registries

## Testing the Setup

1. Build the image:

   ```bash
   docker-compose build
   ```

2. Start the container:

   ```bash
   docker-compose up
   ```

3. Verify the application is running:
   - Open http://localhost:3000 in your browser
   - Check that the product pages load correctly
   - Test the Learning Resources feature

4. Check container status:
   ```bash
   docker-compose ps
   ```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
