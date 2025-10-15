# Infrastructure

Documentation on any Infrastructure setup or changes made.
This project is configured to run in a Dockerized environment using Docker Compose. It uses `pnpm` as the package manager for improved performance and disk space savings. This setup provides a quick and efficient way to run your Next.js app locally using Docker and `pnpm`, ensuring consistency across development environments and simplifying the onboarding process for new developers.

---

## Table of Contents

- [Infrastructure](#infrastructure)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Docker Setup](#docker-setup)
    - [1. **Dockerfile**](#1-dockerfile)
    - [2. **Docker Compose**](#2-docker-compose)
    - [3. **Running the Application**](#3-running-the-application)
  - [Running the Application](#running-the-application)
    - [1. **Build and Run (Detached Mode)**](#1-build-and-run-detached-mode)
    - [2. **Running After Build**](#2-running-after-build)
    - [3. **Stopping the Containers**](#3-stopping-the-containers)
    - [4. **Removing the Containers**](#4-removing-the-containers)
    - [5. **Restarting the Application**](#5-restarting-the-application)
    - [6. **Accessing the Application**](#6-accessing-the-application)
    - [7. **Logs and Debugging**](#7-logs-and-debugging)
  - [Troubleshooting](#troubleshooting)

---

## Prerequisites

Ensure you have the following installed on your machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [pnpm](https://pnpm.io/installation)

---

## Docker Setup

### 1. **Dockerfile**

The `Dockerfile` defines the build and runtime environment for the Next.js application. It uses a multi-stage build to ensure that the final image is small and optimized for production.

Key steps in the `Dockerfile`:

- Install `pnpm`.
- Install dependencies.
- Build the Next.js application.
- Use a minimal image for production.

### 2. **Docker Compose**

The `docker-compose.yml` file sets up the local development environment, including the Next.js app and additional services (like a PostgreSQL database if required).

### 3. **Running the Application**

Once you have set up Docker, you can run the application with the following commands:

---

## Running the Application

### 1. **Build and Run (Detached Mode)**

To build the Docker images and start the application:

```bash
pnpm docker-build
```

### 2. **Running After Build**

To run the application in the background:

```bash
   pnpm docker-run
```

### 3. **Stopping the Containers**

To stop the running containers:

```bash
   pnpm docker-stop
```

### 4. **Removing the Containers**

To remove the containers:

```bash
   pnpm docker-remove
```

### 5. **Restarting the Application**

If you need to restart the app service:

```bash
  pnpm docker-restart
```

### 6. **Accessing the Application**

After the containers are running, the Next.js app will be accessible at:

```bash
   http//:localhost:3000
```

### 7. **Logs and Debugging**

To view logs from the running containers:

```bash
   pnpm docker-logs
```

---

## Troubleshooting

If you encounter issues, check the following:

1. Ensure Docker and Docker Compose are installed correctly.
2. If the app doesn't start, check the logs for errors using the following command:

```bash
docker-compose logs app
```

or check [6. Logs and Debugging](#6-logs-and-debugging)
