# NextJS Product Site

Mock NextJS Product Application for Testing

## ✨ Whats New

- **Learning resources per product:** the product detail page now lists tutorials, guides, and videos that help customers get more value out of each item.
- **Inline authoring experience:** add new resources directly from the UI; submissions are persisted via a new backend API.
- **Learning resources API:** `/api/products/:productId/resources` supports `GET` and `POST` for managing content.
- **Containerised runtime:** build and run the entire site in Docker with a single command, keeping setup consistent across machines.

## Context

This is a dummy product site that needs help adding new features and maturing the project. We are looking for developers who want to help improve various aspects of the site: adding new features, updating the APIs, or improving the project's CI/CD just to name a few. Currently, the project is a basic NextJS application with some tooling built into the project's setup. There are three types of mock data provided: products, users, and orders. Orders link users to products that they have purchased. There are two sizes in JSON format: large (1000+ entries) and small (<= 100 entries).

### What is Current State

- NextJS (`/app` or `/pages`)
- Mock Data (`/src/mock`)
- GitHub Actions for CI/CD (`/.github`)
- Jest (`/tests`)
- Storybook (`/.storybook`)
- Husky (`/.husky`)
- Docs (`/docs`)
- Types (`/src/type`)
- Environment Variables (`.env.local`)
- Prettier
- ESLint
- Folder Structure
- Mock Product Page (`/app/products`)

## Getting Started

### Prerequisite

- [Install Node v22+](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
- [Install PNPM v9+](https://pnpm.io/installation)
- [Install Docker Desktop](https://www.docker.com/products/docker-desktop)

### Setup

1. Clone the repository with `git clone` or fork the repository.
2. Run `pnpm i` to install dependencies.
3. Run `pnpm dev` to start application.
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
5. Navigate to `/products/<productId>` to view product details alongside the new Learning Resources module.

Codespaces is also available and is pre-configured with node and pnpm.

### Storybook

1. Run `pnpm storybook`
2. Open [http://localhost:6006/](http://localhost:6006/) with your browser to see the result.

### Jest

1. Run `pnpm test`

### Docker

```bash
docker compose -f infra/learning-resources/docker-compose.yml up --build
```

- Builds the production image with pnpm and Next.js.
- Mounts `src/mock/resources.json` so any resources you add through the UI are saved on the host.
- Stop the stack with `docker compose -f infra/learning-resources/docker-compose.yml down`.

## Learning Resources Storage Architecture

### Data Persistence Strategy

The learning resources feature uses a **file-based JSON store** with enterprise-grade safety mechanisms. This approach balances simplicity, testability, and production readiness for the MVP phase.

#### Storage Location & Format

**Primary Store**: `src/mock/resources.json`

```json
[
  {
    "id": "uuid-v4",
    "productId": "product-uuid",
    "title": "Resource Title",
    "type": "Article|Video|Guide|Course|Reference",
    "url": "https://example.com/resource",
    "description": "Optional description",
    "estimatedMinutes": 15,
    "createdAt": "2025-10-08T01:36:56.798Z"
  }
]
```

#### Key Features

- **Concurrency Safety**: In-process mutex prevents read-modify-write race conditions
- **Auto-provisioning**: Automatically creates directory structure and empty JSON if missing
- **Environment Flexibility**: Override storage path via `LEARNING_RESOURCES_PATH` environment variable
- **Data Validation**: Schema validation on write, JSON structure validation on read
- **Docker Persistence**: Bind mount ensures data survives container restarts

#### Implementation Details

**Store Abstraction**: `src/utils/learningResources/store.ts`

- Repository pattern with clean separation between storage and business logic
- Functions: `addLearningResource()`, `getResourcesForProduct()`, `listAllResources()`
- UUID generation for unique resource IDs
- ISO timestamp for consistent chronological sorting

**API Integration**: `app/api/products/[productId]/resources/route.ts`

- RESTful endpoints: `GET` (list) and `POST` (create)
- Input validation and error handling
- JSON response format with proper HTTP status codes

**UI Component**: `src/components/ProductResources/ProductResources.tsx`

- Real-time form for adding new resources
- Displays existing resources sorted by creation date
- Optimistic UI updates with error handling

#### Testing Strategy

- **Unit Tests**: `tests/learningResources.test.ts` - store operations, validation, edge cases
- **API Tests**: `tests/apiResources.test.ts` - route handlers, request/response validation
- **Isolated Storage**: Tests use temporary files to avoid conflicts
- **Concurrent Write Testing**: Validates race condition prevention

#### Scaling Considerations

**Current Approach Suitable For:**

- MVP and development phases
- Up to ~1,000 learning resources
- Single-instance deployments
- Git-trackable data (resources version with code)

**Future Migration Path:**

```typescript
// Easy interface swap for production scaling
interface ResourceStore {
  getResourcesForProduct(productId: string): Promise<LearningResource[]>;
  addLearningResource(input: LearningResourceInput): Promise<LearningResource>;
}

// Current: FileStore | Future: SQLiteStore | PostgreSQLStore
```

**Production Recommendations:**

- **1K-10K resources**: Add atomic writes (temp file + rename)
- **>10K resources**: Migrate to SQLite/PostgreSQL
- **Multi-instance**: Use external store (Redis/Database)

#### Verification

Test the storage system:

```bash
# View current stored resources
cat src/mock/resources.json

# Run all storage tests
pnpm test

# Test API persistence
curl -X POST http://localhost:3000/api/products/test-id/resources \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Resource", "url": "https://example.com"}'
```

## Task

Select one of the four areas to contribute to and help enhance the application with features that might not be present. Look at the [GitHub Issues](https://github.com/jhanke00/next-product-site/issues) for capabilities to work on. Feature requests will have the `feature request` label associated with the GitHub Issue and may encompass one or multiple areas of focus. You are not limited to one issue. If you are working on multiple issues, make sure to assign the issues to yourself and link it in your PR.

You can also come up with your own feature request if there are none that cover what you want to contribute. The issues are there to be picked up or to give you an idea of what can be worked on. [Create a new feature request](https://github.com/jhanke00/next-product-site/issues/new?assignees=&labels=feature+request&projects=&template=FEATURE_REQUEST.yml&title=%5BNew+Feature%5D%3A+) that covers what you will be working on and add the appropriate labels for the area of focus that the feature covers.

If you choose to add infrastructure, make sure that it can run locally with Docker. Update the `README.md` with additional local setup information.

> Remember we want to understand your thought process, so if you are unable to complete the changes please note down what has been attempted and what is left to complete.

## Areas of Focus

Setup your PRs based on the following areas of focus. For all changes, please detail what you planned on doing to make those changes in the `/docs` folder and define the MVP. Recent documentation for the learning resources capability can be found under:

- `docs/frontend/learning-resources-ui.md`
- `docs/backend/learning-resources-api.md`
- `docs/devops/learning-resources-docker.md`
- `docs/infrastructure/learning-resources-container.md`

### Frontend

1. Create a new folder under `/app` or `/pages` directory, which will store a new route on the site if you are creating a page. (Ex: `/app/product-search`)
2. Create custom components under `/src/components` and utility functions under `/src/utils` as a directory with the same name as the capability folder. (Ex: `/src/components/product-search`)
3. Create a Markdown file in the `/docs` folder detailing what you are trying to build, how it is used within the application, and how to test your changes. (Ex: `/docs/frontend/products.md`)

### Backend

1. Create a new folder under `/app/api` or `/pages/api` directory, which will store your API route. (Ex: `/app/api/products`)
2. Create utility functions under `/src/utils` as a directory with the same name as the API route. (Ex: `/src/utils/products`)
3. Create a Markdown file in the `/docs` folder detailing what you are trying to build, how it is used within the application, and how to test your changes. (Ex: `/docs/backend/products-api.md`)

### DevOps

1. Create a new workflow file under `/.github/workflows` or actions folder under `/.github/actions`, which will store changes to the GitHub Actions. (Ex: `/.github/workflows/deploy.yml`)
2. Updates to the project can be made directly to the root and additional configuration files may also be created as well. (Ex: `Dockerfile`)
3. Create a Markdown file in the `/docs` folder with the name of your change detailing what you are trying to build, how it is used within the project, and how to test your changes. (Ex: `/docs/devops/github-action-workflow-deploy.md`)

### Infrastructure

1. Create a new folder under `/infra`, which will store the infrastructure setup with Docker. (Ex: `/infra/products`)
2. Create a `Dockerfile` or `docker-compose.yml` for any image you want to use to manage creating local resources. (`/infra/products/Dockerfile`)
3. Create a Markdown file in the `/docs` folder with the name of your change detailing what you are trying to build, how it is used within the project, and how to test your changes. (Ex: `/docs/infrastructure/products-db.md`)

## Contributing

Read more in [Contributing](./CONTRIBUTING.md).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
