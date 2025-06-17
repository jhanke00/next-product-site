# 📄 Product API Endpoints for Large Dataset

## ✅ Overview

This feature adds a backend API routes to serve product data from the **large mock dataset** using Next.js App Router API routes.

- Dataset: `/src/mock/large/products.json` as seed data for database
- Type Used: `Product`

## 🔍 Functionality

### List of products

`GET /api/products`

The route supports filtering based on:

- `name` – partial match (minimum 5 characters)
- `category` – exact match (case-insensitive)

Pagination is supported:

- `page` - number of page to retrieve. Default `1`
- `limit` - number of documents per page. Default `20`

Returns an JSON object with filtered list of products and pagination information.

### Get product by Id

`GET /api/products/:productId`

- `productId` - id of existing products

Returns an JSON object with single product information.

## 🗂️ File Structure

```
/app/api/products/route.ts              → API Route handler
/app/api/products/[productId]/route.ts  → API Route handler
/src/mock/large/products.json           → Dataset used for seeds
/src/utils/products/service             → methods to create a quries to DB
/src/utils/dbClient                     → Prisma client
/src/type/products/*                    → Product type definition
```

## 💻 Endpoints Details

- **Method**: `GET`
- **Path**: `/api/products`
- **Query Parameters**:

  - `search` (optional) → filters by product name
  - `category` (optional) → filters by product category
  - `page` (optional) → number of page to retrieve
  - `limit` (optional) → number of products per page

- **Method**: `GET`
- **Path**: `/api/products/:productId`
- **Path Parameters**:

  - `productId` (required) → id of product

### 🔧 Example Requests:

```bash
GET /api/products
GET /api/products?name=Keyboard&page=1
GET /api/products?category=Electronics&page=1&limit=20
GET /api/products?name=fish&category=Toys
GET /api/products/0003753f-6bf5-4776-8927-725566692392
```

## 🔍 How It Works

- The `GET` method retrieves a data from data-base by using prisma ORM.
- Filters are applied only if query params are present.
- Results are returned using `NextResponse.json()`.

## 🧪 How to Test

1. Setup Postgres DB locally
2. Update .env with correct DATABASE_URL

```bash
pnpm dev-prisma
```

OR

1. Update .env with correct DATABASE_URL
2. use docker compose

Add seed data

```bash
pnpm seed
```

Visit the following in your browser or use Postman:

```
http://localhost:3000/api/products
http://localhost:3000/api/products?name=shirt&page=12
http://localhost:3000/api/products?category=Toys
http://localhost:3000/api/products/0003753f-6bf5-4776-8927-725566692392
```

## 📌 Notes

- Uses TypeScript `Product` type and double assertion to ensure JSON is cast correctly
- API follows REST principles for read-only operations
- No mutations (POST/PUT/DELETE) implemented
