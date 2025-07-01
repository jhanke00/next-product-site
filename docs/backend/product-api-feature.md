# Product API Documentation

## Introduction

This project is a web application that provides a paginated search functionality for products. It includes API endpoints for querying product data based on user-defined parameters such as page, limit, search terms.

## File Structure

- **products/route.ts**: Contain the API logic for handling search requests. It validates query parameters, interacts with the `searchProducts` function to fetch and return paginated results.
- **product/[id]/route.tsx**: Contains the API logic for handling a single product request by ID. It retrieves a product from the Object store using its ID and returns it as JSON response.
- **utils/products.js**: Includes utility functions used accorss the project, such as `searchProducts` and `getProductById`.
- **.env.local**: Contains environment variables for the project.

## Key Features

- **Pagination**: Supports pagination to handle large / small amounts of data efficiently.
- **Search Functionality**: Allow users to filter products based on a search term.
- **Validation**: Ensures query parameters like `limit` do no exceed predefined constraints.
- **Error Handling**: Returns appropriate error message from invalid requests.

## Set Instructions

1. Clone the responsitory:

   ```bash
   git clone <reponsitory-url>

   ```

2. Install dependencies:

   ```bash
   pnpm i

   ```

3. Start the development server:

   ```bash
   pnpm dev

   ```

4. Open your browser and navigate to http://localhost:3000

## Project Structure

```
src/
├── app/
│   └── api/
│       ├── products/
│       │   └── route.ts      # List + search API logic
│       └── product/
│           └── [id]/
│               └── route.tsx # Single product fetch logic
└── utils/
    └── products.ts           # Mock product data & utility functions
```

## API Details

### 1. `GET /api/products`

Fetch a list of products with optional pagination and search query.

#### ✅ Query Parameters:

| Parameter | Type   | Required | Description                                |
| --------- | ------ | -------- | ------------------------------------------ |
| `page`    | number | No       | Page number (default: `1`)                 |
| `limit`   | number | No       | Number of items per page (default: `10`)   |
| `search`  | string | No       | Keyword to search by product title or info |

Method: GET

```
{
  "data": [
    {
        "id": "0aa3e190-55c6-4076-b2b4-50386ba13f53",
        "name": "Licensed Rubber Salad",
        "price": "666.00",
        ...
    },
    ...
  ],
  "pagination": {
        "total": 1,
        "current_page": 1,
        "next_page": null,
        "total_pages": 1,
        "page_limit": 50
    }
}
```

### 2. `GET /api/product/[id]`

Fetch a single product using its id.

🔁 Sample Request:
GET /api/product/0aa3e190-55c6-4076-b2b4-50386ba13f53
📦 Sample Response:

```
{
    "data": {
        "id": "0aa3e190-55c6-4076-b2b4-50386ba13f53",
        "name": "Licensed Rubber Salad",
        "price": "666.00",
        ...
    }
}
```

❌ Error Responses:
400 – Product ID is missing
404 – Product not found

## Local Development

```
npm install
npm run dev
```

Visit:
http://localhost:3000/api/products
http://localhost:3000/api/product/0aa3e190-55c6-4076-b2b4-50386ba13f53
