# DevOps

Documentation on DevOps changes made to the project.

## Documentation Index

### [Docker Setup](./docker-setup.md)

Comprehensive guide to the Docker containerization setup for the Next.js Product Site application.

**Topics Covered:**

- Dockerfile configuration with multi-stage builds
- Docker Compose setup and usage
- Environment configuration
- Testing and troubleshooting
- Production-ready container setup

### [Testing, CI/CD, and Development Tooling](./testing-and-ci.md)

Complete documentation of the testing infrastructure, continuous integration pipeline, and development automation tools.

**Topics Covered:**

- Jest configuration and testing libraries
- Storybook integration for component development
- GitHub Actions CI/CD pipeline
- Code quality tools (Prettier, ESLint, Husky)
- Automated data generation scripts
- Dependency management and best practices

## Quick Reference

### Available Docker Commands

```bash
# Build and start with Docker Compose
docker-compose -f infra/docker-compose.yml up --build

# Stop containers
docker-compose -f infra/docker-compose.yml down
```

### Testing Commands

```bash
# Run all tests
pnpm test

# Start Storybook
pnpm storybook

# Format code
pnpm format
```

### Data Generation

```bash
# Generate large dataset (10k products, 1k users, 50k orders)
pnpm generate-large-data

# Generate small dataset (50 products, 20 users, 100 orders)
pnpm generate-small-data
```

## Recent Changes

### Since Diverging from Main Branch

**Docker & Containerization:**

- Added Dockerfile with Node.js 22 Alpine
- Created docker-compose.yml for easy deployment
- Added .dockerignore for optimized builds
- Configured Next.js standalone output mode

**Testing Infrastructure:**

- Enhanced Jest configuration for React/TSX testing
- Added Testing Library suite (@testing-library/react, jest-dom, user-event)
- Configured jsdom test environment
- Expanded coverage collection to include app/ directory
- Created comprehensive test suites for API and components

**Storybook Integration:**

- Configured Storybook with Next.js framework support
- Added Jest addon for test result visualization
- Created story files for Products and ProductDetails components
- Implemented interactive play functions for automated testing

**CI/CD Pipeline:**

- Created GitHub Actions workflow for pull requests
- Implemented parallel jobs for build, test, and lint
- Added reusable configuration action
- Enforced Node.js 22 and pnpm 9 standards

**Code Quality Tools:**

- Added Prettier configuration with 120-char line width
- Implemented pre-commit hooks with Husky
- Configured Dependabot for monthly updates
- Added package manager enforcement (pnpm-only)

**Data Generation:**

- Enhanced data generation scripts with learning resources
- Migrated product IDs to UUID format
- Added separate large/small data generation commands
- Integrated Faker.js for realistic test data

## Getting Started

### For Development

1. Install dependencies: `pnpm install`
2. Generate test data: `pnpm generate-small-data`
3. Run tests: `pnpm test`
4. Start Storybook: `pnpm storybook`
5. Start dev server: `pnpm dev`

### For Production

1. Build Docker image: `docker-compose -f infra/docker-compose.yml build`
2. Start container: `docker-compose -f infra/docker-compose.yml up`
3. Access at http://localhost:3000

### For Contributors

1. All commits are automatically formatted via pre-commit hook
2. CI must pass (build, test, lint) before merging PRs
3. Use `pnpm` exclusively (enforced by preinstall script)
4. Follow the testing and documentation standards

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Jest Documentation](https://jestjs.io/)
- [Storybook Documentation](https://storybook.js.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Prettier Documentation](https://prettier.io/)
- [Testing Library Documentation](https://testing-library.com/)
