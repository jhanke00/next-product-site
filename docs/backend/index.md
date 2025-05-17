# Backend

Documentation on any Backend capabilities or changes made.

## Issues

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

### Run tests manually

1. `pnpm dev-db` -> runs psql db
2. `pnpm test` -> runs tests

### Run tests ci

1. `pnpm test-ci` -> according to docker-compose, creates psql container, builds an app, runs 'pnpm test'

### Local dev

1. `pnpm dev` -> generates schema and types according to prisma.schema, runs seed script which fills db by mock products data, runs local server. Data on production page are served from db.

### Strorybook

1. `pnpm storybook` -> runs storybook, data served from mocks
