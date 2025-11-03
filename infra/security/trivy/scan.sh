#!/usr/bin/env bash

set -euo pipefail

if ! command -v trivy >/dev/null 2>&1; then
  echo "Trivy is required. Install from https://aquasecurity.github.io/trivy/v0.54.1/getting-started/installation/." >&2
  exit 1
fi

echo "Running Trivy vulnerability and secret scan..."

trivy fs \
  --scanners vuln,secret \
  --severity HIGH,CRITICAL \
  --ignore-unfixed \
  --exit-code 1 \
  .

echo "Scan complete."

