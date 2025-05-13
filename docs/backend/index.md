# Backend

Documentation on any Backend capabilities or changes made.

Command to start the application: `docker-compose up`

---

## 1. [New Feature]: Search products #142 [PENDING]

- Not started (Frontend)

---

## 2. [New Feature]: Order API Endpoint #139 – [COMPLETED]

Orders API End Point: http://localhost:3000/api/orders

### Summary

1. Implemented a RESTful API structure using Next.js App Router by creating route files under: app/api/<module_name>/route.ts

Example for orders:
app/api/orders/route.ts

2. Decoupled Route Handlers
   Each route.ts file acts as a thin HTTP layer that delegates business logic to internal handler functions. This improves modularity and testability.

3. Centralized Order Logic
   Created a dedicated module: src/api/orders/orderAPI.ts

4. This file houses all core CRUD operations for orders:
   createOrder
   getOrderById
   updateOrder
   deleteOrder
   getAllOrders

### Utility Functions Architecture

1. Introduced a structured utility system for reusable logic:
   src/utils/orders/
   src/utils/products/

2. Reusable, Typed Functions
   Each module contains reusable utility functions — such as input validation, data formatting, and helpers — scoped by feature. This makes logic composable and maintainable.

---

## 3. [New Feature]: User Information Page #101 [PENDING]

- Not started

---

## 4. [New Feature]: Docker local environment #91 [COMPLETED]

### Summary

#### Docker Setup Progress

- Installed Docker Desktop on the local machine.
- Verified Docker installation and ensured the engine is running.
- Created a Dockerfile to containerize the Next.js application using pnpm and Node.js base image.
- Created a .dockerignore file to exclude unnecessary files and folders (e.g., node_modules, .git, .next) from being copied into the Docker image.
- Built the Docker image using `docker build .`.
- Resolved Docker build error by excluding node_modules in .dockerignore.
- Created a docker-compose.yml to simplify running the local environment with a single command (docker-compose up).
- Successfully ran the Next.js app inside a Docker container and confirmed it runs at http://localhost:3000.

Command to start the application in docker: `docker-compose up`

---

## 5. [New Feature]: Filter products #89 [PENDING]

- Not Started

---

## 6. [New Feature]: Improve product list page using cards. #84 [PENDING]

- Not Started

---

## 7. [New Feature]: Improve product list page using cards. #84 [PENDING]

- Not Started

---

## 8. [New Feature]: Enhance CI/CD with Pre-commit Hooks for Linting, Formatting, and Testing #82 [COMPLETED]

### Implemented Tools & Setup

#### Husky (Pre-commit Hooks)

- Initialized Husky in the project using `pnpm dlx husky-init`.
- Configured `.husky/pre-commit` hook to automatically:
- Run ESLint for linting and fixing issues.
- Run Prettier to validate code formatting.
- Run Jest to ensure all tests pass.
- Ensures only clean, tested, and properly formatted code is committed.

#### ESLint

- Installed eslint along with `eslint-config-next` and TypeScript plugin support.
- Configured it to lint .ts and .tsx files with automatic fix support.
- Ensures consistent code quality and catches common errors early.

#### Prettier

- Added Prettier for consistent code formatting across the team.
- Integrated with pre-commit hooks to prevent poorly formatted code from being committed.

#### Jest

- Ensured that unit tests run automatically on each commit to prevent regressions.
- Hooked into Husky pre-commit to ensure commits do not break functionality.

Ran `git commit -m "check working pre-commit"` — the pre-commit hook successfully triggered linting, formatting, and tests before the commit was finalized.

---

# 9. [New Feature]: Improve the experience of searching for and viewing products #80 [PENDING]

- Not started

---

# 10. [Bug]: Error when trying to run storybook command #78 [COMPLETED]

- The import path `@/src/mock/large/products.json` in `app/products/page.tsx` was incorrect due to a misconfigured alias. A new path alias has now been added: `@/*` maps to `./src/*`, enabling correct imports like `@/mock/large/products.json`.

---

# 11. [New Feature]: improve workflow and code quality #75 [PENDING]

- Not started

---

# 12. [Bug]: error when run pnpm storybook command #73 [COMPLETED]

- Same issue (#10). Already resolved.

---

# 13. Add MongoDB as a container:  #59 [PENDING]

- Not Started

---

# 14. Add Backend Database #57 [PENDING]

---
# 15. [New Feature]: REST API for Handling User Authentication #10 [IN-PROGRESS]
- In Progress

---