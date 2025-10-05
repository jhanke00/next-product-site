# Docker Setup and Usage Guide

This Next.js Learning Management System comes with a complete Docker setup for easy deployment and development.

## Quick Start

### Production Deployment

1. **Build and run with Docker Compose:**

   ```bash
   docker-compose up -d
   ```

2. **Check application health:**
   ```bash
   curl http://localhost:3000/api/health
   ```

### Development with Docker

1. **Build the Docker image:**

   ```bash
   docker build -t next-product-site .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:3000 --name next-product-site next-product-site
   ```

## Docker Configuration

### Multi-stage Dockerfile

The application uses a multi-stage Docker build:

- **Stage 1 (deps):** Install dependencies using pnpm
- **Stage 2 (builder):** Build the Next.js application
- **Stage 3 (runner):** Production runtime with minimal footprint

### Key Features

- ✅ **Multi-stage build** for optimized image size
- ✅ **Non-root user** for security
- ✅ **Health checks** for monitoring
- ✅ **Persistent data** mounting for JSON storage
- ✅ **Environment configuration**
- ✅ **Standalone output** for optimal performance

### File Structure

```
docker/
├── Dockerfile              # Multi-stage build configuration
├── docker-compose.yml      # Production deployment
├── .dockerignore           # Build context optimization
├── healthcheck.js          # Node.js health check script
├── healthcheck.sh          # Shell health check script
└── docker-scripts.json    # Useful Docker commands
```

## Available Commands

### Docker Compose Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild images
docker-compose build

# Check service status
docker-compose ps
```

### Individual Docker Commands

```bash
# Build image
docker build -t next-product-site .

# Run container
docker run -p 3000:3000 next-product-site

# Check health
curl http://localhost:3000/api/health

# View container logs
docker logs next-product-site

# Stop and remove container
docker stop next-product-site && docker rm next-product-site
```

## Environment Variables

| Variable                  | Default      | Description               |
| ------------------------- | ------------ | ------------------------- |
| `NODE_ENV`                | `production` | Node.js environment       |
| `PORT`                    | `3000`       | Application port          |
| `HOSTNAME`                | `0.0.0.0`    | Bind hostname             |
| `NEXT_TELEMETRY_DISABLED` | `1`          | Disable Next.js telemetry |

## Data Persistence

The Docker setup mounts the following directories for data persistence:

- `./src/data` → `/app/src/data` (JSON data files)
- `./public` → `/app/public` (Static assets and media)

## Health Monitoring

The application includes comprehensive health checks:

- **Endpoint:** `GET /api/health`
- **Interval:** Every 30 seconds
- **Timeout:** 10 seconds
- **Retries:** 3 attempts

Health check response:

```json
{
  \"status\": \"healthy\",
  \"timestamp\": \"2024-01-15T10:30:00.000Z\",
  \"uptime\": 3600,
  \"environment\": \"production\",
  \"version\": \"1.0.0\",
  \"services\": {
    \"api\": \"operational\",
    \"storage\": \"operational\"
  }
}
```

## Troubleshooting

### Common Issues

1. **Port already in use:**

   ```bash
   # Check what's using port 3000
   netstat -tulpn | grep 3000

   # Use different port
   docker run -p 3001:3000 next-product-site
   ```

2. **Build failures:**

   ```bash
   # Clean Docker cache
   docker system prune -af

   # Rebuild without cache
   docker build --no-cache -t next-product-site .
   ```

3. **Health check failures:**

   ```bash
   # Check container logs
   docker logs next-product-site

   # Test health endpoint manually
   docker exec next-product-site curl localhost:3000/api/health
   ```

### Performance Optimization

1. **Image size optimization:**
   - Uses Alpine Linux base image
   - Multi-stage build removes build dependencies
   - Standalone Next.js output reduces runtime size

2. **Runtime optimization:**
   - Non-root user for security
   - Health checks for reliability
   - Proper signal handling for graceful shutdowns

## Production Deployment

For production deployment, consider:

1. **Environment variables:**
   - Set `NODE_ENV=production`
   - Configure proper `HOSTNAME` and `PORT`
   - Add application-specific environment variables

2. **Resource limits:**

   ```yaml
   services:
     nextjs-app:
       deploy:
         resources:
           limits:
             memory: 512M
             cpus: '0.5'
   ```

3. **Monitoring:**
   - Set up log aggregation
   - Monitor health check endpoints
   - Configure alerts for container failures

4. **Security:**
   - Use secrets for sensitive data
   - Enable read-only file system where possible
   - Regular security updates for base images
