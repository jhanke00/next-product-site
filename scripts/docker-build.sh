#!/bin/bash

# Docker build script for Next.js Product Site
set -e

echo "Building Next.js Product Site Docker image..."

# Build the Docker image
docker build -t next-product-site:latest .

echo "Docker image built successfully!"
echo "To run the container:"
echo "   docker run -p 3000:3000 next-product-site:latest"
