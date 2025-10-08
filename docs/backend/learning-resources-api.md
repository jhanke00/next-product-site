# Learning Resources API

## Overview

A dedicated REST endpoint now powers learning content attached to each product. The route exposes `GET` and `POST` operations so the UI (or external clients) can list existing resources and add new tutorials on demand.

## Endpoint

| Method | Route                                | Description                           |
| ------ | ------------------------------------ | ------------------------------------- |
| GET    | `/api/products/:productId/resources` | Returns all resources for a product.  |
| POST   | `/api/products/:productId/resources` | Creates a new resource for a product. |

## Payload Contract

### POST Request Body

```jsonc
{
  "title": "Required string",
  "url": "https://example.com",
  "type": "Article | Video | Guide | Course | Reference",
  "description": "Optional details",
  "estimatedMinutes": 30,
}
```

### Response Shape

```jsonc
{
  "resource": {
    "id": "uuid",
    "productId": "string",
    "title": "string",
    "type": "Article",
    "url": "https://…",
    "description": "string?",
    "estimatedMinutes": 30,
    "createdAt": "ISO timestamp",
  },
}
```

## Storage

- Data is persisted to `src/mock/resources.json` (shared with tests and the UI).
- Utility functions live in `src/utils/learningResources/store.ts` to encapsulate validation, parsing, and persistence.

## Testing

- Execute `pnpm test learning-resources` (see new Jest suite under `tests/learningResources.test.ts`).
- Manual smoke test with `curl`:
  - `GET http://localhost:3000/api/products/<id>/resources`
  - `POST http://localhost:3000/api/products/<id>/resources` with JSON body to create a record.
