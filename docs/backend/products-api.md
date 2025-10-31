# Products API

This document describes the backend Products API added under the Next.js App Router, how the utilities support it, and how to test and use the endpoint within the application.

## Overview

- Endpoint: `GET /api/products`
- Purpose: Provide product listings with server-side filtering and pagination.
- Backed by utilities in `src/utils/products` that load mock data and apply search, category filters, and pagination.

## Request Query Parameters

- `page` (number, optional): Current page. Defaults to `1`. Clamped to valid range.
- `pageSize` (number, optional): Items per page. Defaults to `20`. Max `100`.
- `search` (string, optional): Case-insensitive search across product name and description.
- `category` (string, optional): Exact match on product category.

## Response Shape

```json
{
  "data": [
    { "id": 1, "name": "Product name", "category": "Category", ... }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 120,
  "totalPages": 6,
  "search": "",
  "category": "",
  "categories": ["Books", "Electronics", "Fashion"]
}
```

## Files Added

- `app/api/products/route.ts`: Next.js API route that reads query params and returns JSON.
- `src/utils/products/index.ts`: Utilities for loading mock data, filtering, and paginating.

## How It’s Used In The App

- The products listing page can use `fetch('/api/products?category=...&search=...&page=...')` to retrieve server-side filtered results.
- The endpoint mirrors the client-side logic already present, enabling consistent deep links and easier testing.

## Testing Instructions

1. Start the dev server:
   - `npm run dev`
2. Make a simple request:
   - `curl 'http://localhost:3001/api/products'`
3. With pagination:
   - `curl 'http://localhost:3001/api/products?page=2&pageSize=10'`
4. With search:
   - `curl 'http://localhost:3001/api/products?search=phone'`
5. With category filter:
   - `curl 'http://localhost:3001/api/products?category=Electronics'`
6. Combine:
   - `curl 'http://localhost:3001/api/products?category=Books&search=guide&page=3&pageSize=5'`

Expect a JSON response containing `data` and pagination metadata as described above.

## Notes

- Data sources: `src/mock/large/products.json` (preferred) and `src/mock/small/products.json` (fallback).
- Types: A lightweight `Product` type is defined in the utilities with optional fields to accommodate the mock data shape.
