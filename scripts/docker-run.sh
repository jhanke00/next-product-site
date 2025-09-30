#!/bin/bash

# Docker run script for Next.js Product Site
set -e

echo "Starting Next.js Product Site container..."

# Stop and remove existing container if it exists
docker stop next-product-site 2>/dev/null || true
docker rm next-product-site 2>/dev/null || true

# Run the container
docker run -d \
  --name next-product-site \
  -p 3000:3000 \
  --restart unless-stopped \
  next-product-site:latest

echo "✅ Container started successfully!"
echo "🌐 Application is available at http://localhost:3000"
echo "📊 Health check: http://localhost:3000/api/health"
echo ""
echo "🔍 To view logs:"
echo "   docker logs -f next-product-site"
echo ""
echo "🛑 To stop the container:"
echo "   docker stop next-product-site"
