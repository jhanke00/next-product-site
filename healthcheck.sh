#!/bin/bash

# Health check script for Docker containers
# This script is used by Docker HEALTHCHECK instruction

# Function to check HTTP endpoint
check_http() {
    local url=$1
    local timeout=${2:-5}
    
    # Use curl to check if the health endpoint responds
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $timeout "$url" 2>/dev/null)
    
    if [ "$response" = "200" ]; then
        echo "Health check passed - HTTP $response"
        return 0
    else
        echo "Health check failed - HTTP $response"
        return 1
    fi
}

# Main health check
HEALTH_URL="${HEALTH_URL:-http://localhost:3000/api/health}"

echo "Running health check on $HEALTH_URL"

if check_http "$HEALTH_URL"; then
    echo "Container is healthy"
    exit 0
else
    echo "Container is unhealthy"
    exit 1
fi