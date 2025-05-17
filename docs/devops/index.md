# DevOps

Documentation on any DevOps changes made.

### Issues

Issues related 73, 91, 82, 57 -> https://github.com/jhanke00/next-product-site/pull/148

- configured PSQL DB using prisma ORM.
- added Dockefile and docker-compose for local development(db) and Jest tests on local development and CI(test-db)
- modified CI to also runs all backend tests
- added sample unit test
- seed mock products to db before app starts
- sample getProducts endpoint (API route) with pagination
- updated package.json to easily work locally, running ci script, seed etc.
- updated products page. Data now are served from db (and keeping existing mock logic for storybook users)
- fixed storybook issue related to imports

### Ci

- ci runs now `pnpm test-ci` which runs package.json script. It runs docker-compose `test-runner` script after test-db is healthy. Dockerfile is building the app and runs tests.
