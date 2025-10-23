# Backend — Learning Resources API

What I added

- App-route handlers at `app/api/products/[productId]/resources/route.ts` supporting:
  - GET: return learning resources for a product
  - POST: create a new learning resource (in-memory)

Notes on persistence

- For demo purposes the API maintains an in-memory array (initialized from `src/mock/small/learning-resources.json`). This means new resources are lost when the server restarts.
- To persist data, implement one of:
  - File-based storage (append/atomic write to JSON) — simple and low-risk for local demos.
  - SQLite / Postgres — add a DB and update route to read/write.

How to test

1. Start the dev server: `pnpm dev`.
2. Use the UI (product detail page) to create a resource OR use curl/postman:

   GET http://localhost:3000/api/products/<productId>/resources
   POST http://localhost:3000/api/products/<productId>/resources
   Body: { "title": "My Guide", "type": "guide", "url": "https://...", "description": "..." }

Security and validation

- Currently there is no server-side input validation or auth. Add validation (e.g., zod) and authentication for production use.
