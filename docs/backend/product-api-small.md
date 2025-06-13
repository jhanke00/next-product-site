# 📄 Product API Endpoint for Small Dataset

## ✅ Overview

This feature adds a backend API route to serve product data from the **small mock dataset** using Next.js App Router API routes.

- File Location: `/app/api/products/route.ts`
- Dataset: `/src/mock/small/products.json`
- Type Used: `Product` from `/src/type/products/index.ts`

## 🔍 Functionality

The route supports filtering based on:

- `name` – partial match (minimum 5 characters)
- `category` – exact match (case-insensitive)

Returns a filtered list of products as a JSON array.

## 🗂️ File Structure

```
/app/api/products/route.ts               → API Route handler
/src/mock/small/products.json           → Dataset used
/src/type/products/index.ts             → Product type definition
```

## 💻 Endpoint Details

- **Method**: `GET`
- **Path**: `/api/products`
- **Query Parameters**:

  - `name` (optional) → filters by product name
  - `category` (optional) → filters by product category

### 🔧 Example Requests:

```bash
GET /api/products
GET /api/products?name=Keyboard
GET /api/products?category=Electronics
GET /api/products?name=fish&category=toys
```

## 🔍 How It Works

- The `GET` method reads from the small mock dataset.
- Filters are applied only if query params are present.
- Results are returned using `NextResponse.json()`.

## 🧪 How to Test

```bash
pnpm dev
```

Visit the following in your browser or use Postman:

```
http://localhost:3000/api/products
http://localhost:3000/api/products?name=shirt
http://localhost:3000/api/products?category=Toys
```

## 📌 Notes

- Uses TypeScript `Product` type and double assertion to ensure JSON is cast correctly
- API follows REST principles for read-only operations
- No mutations (POST/PUT/DELETE) implemented

---

Ready for PR submission under issue: [#150](https://github.com/jhanke00/next-product-site/issues/150)
