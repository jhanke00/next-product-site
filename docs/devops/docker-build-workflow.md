# Docker Build Workflow

## Overview

To improve our DevOps posture, we introduced a GitHub Actions workflow named `Verify Docker Build`. The workflow ensures the application can be containerised and started successfully whenever code is pushed to `main`, a pull request targets `main`, or the workflow is launched manually.

## Workflow Details

- **Location**: `.github/workflows/container-build.yml`
- **Triggers**: `push`, `pull_request` (against `main`), and `workflow_dispatch`
- **Steps**:
  1. Check out the repository.
  2. Configure Docker Buildx.
  3. Cache Docker layers for faster subsequent runs.
  4. Build the application image using the project `Dockerfile`.
  5. Start the container and print the logs to verify the server boots without errors.

The workflow uses layer caching to keep the feedback loop quick while still providing confidence that the Docker image can be built from scratch.

## Supporting Files

- **Dockerfile**: Added at the repository root. It is a multi-stage build that installs dependencies with `pnpm`, builds the Next.js application, prunes development packages, and runs the app in production mode on port `3000`.

## Local Testing

To mirror the workflow locally:

```bash
docker build -t next-product-site:local .
docker run --rm -p 3000:3000 next-product-site:local
```

After the container reports `ready - started server` in the logs, visit [http://localhost:3000](http://localhost:3000) to confirm the site loads. Stop the container with `Ctrl+C`.

## Next Steps

- Wire the workflow up to a container registry (e.g. GHCR) for automated pushes.
- Add a short integration test that curls the health endpoint while the container is running.
