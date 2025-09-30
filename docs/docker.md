# Docker Deployment Guide

This guide explains how to run the Next.js Product Site using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier management)

## Quick Start

### Using Docker

1. **Build the image:**

   ```bash
   docker build -t next-product-site .
   ```

2. **Run the container:**

   ```bash
   docker run -p 3000:3000 next-product-site
   ```

3. **Access the application:**
   Open http://localhost:3000 in your browser

### Using Docker Compose

1. **Production deployment:**

   ```bash
   docker-compose up -d
   ```

2. **Development mode:**

   ```bash
   docker-compose --profile dev up
   ```

3. **Stop services:**
   ```bash
   docker-compose down
   ```

## Configuration

### Environment Variables

The container supports the following environment variables:

- `NODE_ENV`: Set to 'production' for production deployment
- `PORT`: Port to run the application (default: 3000)
- `HOSTNAME`: Host to bind to (default: 0.0.0.0)
- `NEXT_TELEMETRY_DISABLED`: Disable Next.js telemetry (default: 1)

### Custom Environment File

Create a `.env.local` file in the project root for custom environment variables:

```bash
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CUSTOM_VARIABLE=value
```

Then mount it in the container:

```bash
docker run -p 3000:3000 -v $(pwd)/.env.local:/app/.env.local next-product-site
```

## Health Check

The application includes a health check endpoint at `/api/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2025-01-27T10:00:00.000Z",
  "version": "1.0.0"
}
```

## Multi-stage Build

The Dockerfile uses a multi-stage build process:

1. **deps**: Installs dependencies
2. **builder**: Builds the application
3. **runner**: Creates the production image

This approach minimizes the final image size and improves security.

## Performance Optimizations

- Uses Node.js 18 Alpine for smaller image size
- Leverages Next.js standalone output for optimal performance
- Non-root user for security
- Efficient layer caching

## Troubleshooting

### Common Issues

1. **Port already in use:**

   ```bash
   docker run -p 3001:3000 next-product-site
   ```

2. **Permission denied:**
   Ensure Docker daemon is running and you have proper permissions.

3. **Build fails:**
   Check that all dependencies are listed in package.json and pnpm-lock.yaml exists.

### Logs

View container logs:

```bash
docker logs <container-name>
```

Or with Docker Compose:

```bash
docker-compose logs next-product-site
```

## Production Considerations

- Use a reverse proxy (nginx) for SSL termination
- Implement proper logging and monitoring
- Consider using Docker secrets for sensitive data
- Set up automated backups for data files
- Use container orchestration (Kubernetes, Docker Swarm) for scaling
