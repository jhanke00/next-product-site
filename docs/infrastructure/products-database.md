# Products Database Documentation

This document describes the local database setup using Docker Compose for the Products API. It includes configuration for a PostgreSQL database container for local testing purposes.

---

## Services

### 1. `postgres`

A PostgreSQL container for persistent relational data storage.

#### Configuration

| Key              | Value               | Description                              |
| ---------------- | ------------------- | ---------------------------------------- |
| `image`          | `postgres:17.5`     | The Docker image used for the container  |
| `container_name` | `products_postgres` | Custom name for the PostgreSQL container |
| `restart`        | `unless-stopped`    | Restart policy                           |

#### Environment Variables

| Variable            | Value      | Description                  |
| ------------------- | ---------- | ---------------------------- |
| `POSTGRES_USER`     | `user`     | Username for PostgreSQL      |
| `POSTGRES_PASSWORD` | `password` | Password for PostgreSQL      |
| `POSTGRES_DB`       | `products` | Name of the default database |

#### Volumes

Mounts a Docker-managed volume for data persistence:

```yaml
volumes:
  - pgdata:/var/lib/postgresql/data
```

#### Running Docker

1. Go to `/infra/products` in your terminal.
2. Run `docker compose up`
