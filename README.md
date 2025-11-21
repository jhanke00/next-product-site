# NextJS Product Site

Mock NextJS Product Application

## Overview

This is a Next.js application that displays product information with mock data. The application includes products, users, and orders data, with two dataset sizes: large (1000+ entries) and small (<= 100 entries).

## Features

### Learning Resources

The application includes a Learning Resources feature that allows users to view and manage learning resources (guides, tutorials, videos, and documentation) for each product.

**Implementation includes:**

- Frontend components for viewing and adding learning resources on product detail pages
- RESTful API endpoints for CRUD operations on learning resources
- Docker containerization support for easy deployment

**Documentation:**

- [Frontend Documentation](./docs/frontend/learning-resources.md)
- [Backend API Documentation](./docs/backend/learning-resources-api.md)
- [Infrastructure Documentation](./docs/infrastructure/docker-setup.md)

## Getting Started

### Prerequisites

- [Node v22+](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
- [PNPM v9+](https://pnpm.io/installation)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (optional, for containerized deployment)

### Local Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/jhanke00/next-product-site.git
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Docker Setup

The application can be run using Docker for containerized deployment.

#### Using Docker Compose (Recommended)

1. Build and start the container:

   ```bash
   docker-compose up --build
   ```

2. The application will be available at [http://localhost:3000](http://localhost:3000)

3. To run in detached mode:

   ```bash
   docker-compose up -d
   ```

4. To stop the container:
   ```bash
   docker-compose down
   ```

#### Using Docker directly

1. Build the Docker image:

   ```bash
   docker build -t next-product-site .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 next-product-site
   ```

For more detailed Docker setup instructions, see [Docker Setup Documentation](./docs/infrastructure/docker-setup.md).

## Project Structure

- `/app` - Next.js App Router pages and API routes
- `/src/components` - React components
- `/src/utils` - Utility functions
- `/src/type` - TypeScript type definitions
- `/src/mock` - Mock data files (products, users, orders, learning resources)
- `/docs` - Documentation files

## Contributing

Read more in [Contributing](./CONTRIBUTING.md).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
