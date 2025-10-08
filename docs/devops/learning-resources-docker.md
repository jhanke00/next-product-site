# Docker Workflow for Learning Resources Feature

## Overview

To simplify local setup and parity across environments, the application can now run fully containerised. The image bundles build dependencies, compiles the Next.js app, and launches it with `pnpm start`.

## Artifacts

- `Dockerfile` (project root): multi-stage build that installs dependencies, runs `pnpm build`, and publishes the production bundle.
- `.dockerignore`: trims the build context to keep images light.
- `infra/learning-resources/docker-compose.yml`: convenience wrapper for local runs with a bind mount that persists `resources.json` updates between restarts.

## Usage

### Build & Run

```bash
# from repository root
pnpm build
docker compose -f infra/learning-resources/docker-compose.yml up --build
```

Then visit [http://localhost:3000](http://localhost:3000) to access the production build.

### Tear Down

```bash
docker compose -f infra/learning-resources/docker-compose.yml down
```

## Notes

- `NEXT_TELEMETRY_DISABLED` is set for privacy and deterministic builds.
- The bind mount `src/mock/resources.json` ensures data written through the API is visible on the host.
- During development you can override the command (`pnpm dev`) in `docker-compose.yml` if you prefer hot reloading inside the container.
