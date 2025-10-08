# Infrastructure: Container Runtime Support

## Objective

Provide an infrastructure-as-code entry point under `/infra` that allows anyone to provision the product site (with learning resources storage) in a single command.

## Deliverables

- `infra/learning-resources/docker-compose.yml` exposes a `next-product-site` service.
- Service builds directly from the repository using the root `Dockerfile`.
- Binds `src/mock/resources.json` into the container to persist API writes from the learning resources feature.
- Configures `restart: unless-stopped` for long-running environments.

## Running the Stack

```bash
docker compose -f infra/learning-resources/docker-compose.yml up --build -d
```

The application boots on <http://localhost:3000>. To inspect logs:

```bash
docker compose -f infra/learning-resources/docker-compose.yml logs -f
```

## Clean Up

```bash
docker compose -f infra/learning-resources/docker-compose.yml down
```

## Future Enhancements

- Add a volume for the entire `src/mock` directory if additional JSON stores are introduced.
- Extend the compose file with a lightweight JSON-server or database when persistence requirements grow.
