# Backend API

This document describes the RESTful API endpoints available in the Next.js application.

## Base URL

```
http://localhost:3000/api
```

## API Response Format

All API responses follow a standard format:

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### Products

#### GET /api/products

Get all products with optional pagination, search, and filtering.

**Query Parameters:**

| Parameter   | Type    | Default | Description                           |
| ----------- | ------- | ------- | ------------------------------------- |
| `page`      | number  | 1       | Page number                           |
| `limit`     | number  | 20      | Items per page (max: 100)             |
| `search`    | string  | -       | Search in product name or description |
| `category`  | string  | -       | Filter by category                    |
| `minPrice`  | number  | -       | Minimum price filter                  |
| `maxPrice`  | number  | -       | Maximum price filter                  |
| `minRating` | number  | -       | Minimum rating filter                 |
| `inStock`   | boolean | -       | Filter for in-stock products only     |

**Example Requests:**

```bash
# Get first page with 20 items
GET /api/products?page=1&limit=20

# Search for "bike"
GET /api/products?search=bike

# Filter by category
GET /api/products?category=Electronics

# Filter by price range
GET /api/products?minPrice=100&maxPrice=500

# Get in-stock products only
GET /api/products?inStock=true
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "0e5e5900-29dd-46d6-af40-f8be36445b81",
      "name": "Luxurious Concrete Bacon",
      "price": "920.00",
      "description": "The automobile layout consists of a front-engine design...",
      "category": "Jewelery",
      "rating": 3.3075761899817735,
      "numReviews": 40,
      "countInStock": 87
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

#### GET /api/products/[id]

Get a single product by ID.

**Path Parameters:**

| Parameter | Type   | Description  |
| --------- | ------ | ------------ |
| `id`      | string | Product UUID |

**Example Request:**

```bash
GET /api/products/0e5e5900-29dd-46d6-af40-f8be36445b81
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "0e5e5900-29dd-46d6-af40-f8be36445b81",
    "name": "Luxurious Concrete Bacon",
    "price": "920.00",
    "description": "The automobile layout consists of a front-engine design...",
    "category": "Jewelery",
    "rating": 3.3075761899817735,
    "numReviews": 40,
    "countInStock": 87
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": "Product not found"
}
```

---

### Users

#### GET /api/users

Get all users with optional pagination and search.

**Query Parameters:**

| Parameter | Type   | Default | Description               |
| --------- | ------ | ------- | ------------------------- |
| `page`    | number | 1       | Page number               |
| `limit`   | number | 20      | Items per page (max: 100) |
| `search`  | string | -       | Search in name or email   |

**Example Requests:**

```bash
# Get first page
GET /api/users?page=1&limit=20

# Search for user
GET /api/users?search=john
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "a294bba5-a61f-40fc-bdaf-120886b3c4b2",
      "firstName": "Carolyne",
      "lastName": "Gleason",
      "phoneNumber": "1-216-309-9506 x47403",
      "email": "Carolyne.Gleason3@hotmail.com"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 20,
    "totalPages": 1
  }
}
```

#### GET /api/users/[id]

Get a single user by ID.

**Path Parameters:**

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| `id`      | string | User UUID   |

**Example Request:**

```bash
GET /api/users/a294bba5-a61f-40fc-bdaf-120886b3c4b2
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "a294bba5-a61f-40fc-bdaf-120886b3c4b2",
    "firstName": "Carolyne",
    "lastName": "Gleason",
    "phoneNumber": "1-216-309-9506 x47403",
    "email": "Carolyne.Gleason3@hotmail.com"
  }
}
```

---

### Orders

#### GET /api/orders

Get all orders with optional pagination and filtering.

**Query Parameters:**

| Parameter  | Type   | Default | Description                |
| ---------- | ------ | ------- | -------------------------- |
| `page`     | number | 1       | Page number                |
| `limit`    | number | 20      | Items per page (max: 100)  |
| `userId`   | string | -       | Filter orders by user ID   |
| `minTotal` | number | -       | Minimum order total filter |
| `maxTotal` | number | -       | Maximum order total filter |

**Example Requests:**

```bash
# Get all orders
GET /api/orders?page=1&limit=20

# Get orders for a specific user
GET /api/orders?userId=ebfc5306-7876-41f2-9979-eb0d1cbcc87d

# Filter by total amount
GET /api/orders?minTotal=1000&maxTotal=5000
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 0,
      "user": "ebfc5306-7876-41f2-9979-eb0d1cbcc87d",
      "items": [
        {
          "id": "c24e2fc7-bba6-443b-9279-babfdf78bb05",
          "name": "Small Concrete Bacon",
          "price": "540.00",
          "count": 3
        }
      ],
      "total": 2206,
      "time": "2024-10-27T14:42:38.259Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### GET /api/orders/[id]

Get a single order by index ID.

**Path Parameters:**

| Parameter | Type   | Description           |
| --------- | ------ | --------------------- |
| `id`      | number | Order index (0-based) |

**Example Request:**

```bash
GET /api/orders/0
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": 0,
    "user": "ebfc5306-7876-41f2-9979-eb0d1cbcc87d",
    "items": [
      {
        "id": "c24e2fc7-bba6-443b-9279-babfdf78bb05",
        "name": "Small Concrete Bacon",
        "price": "540.00",
        "count": 3
      }
    ],
    "total": 2206,
    "time": "2024-10-27T14:42:38.259Z"
  }
}
```

---

## Implementation Details

### File Structure

```
app/api/
├── products/
│   ├── route.ts              # GET /api/products
│   └── [id]/
│       └── route.ts          # GET /api/products/:id
├── users/
│   ├── route.ts              # GET /api/users
│   └── [id]/
│       └── route.ts          # GET /api/users/:id
└── orders/
    ├── route.ts              # GET /api/orders
    └── [id]/
        └── route.ts          # GET /api/orders/:id

src/utils/
└── api.ts                    # Utility functions for API responses and pagination
```

### Utility Functions

The API uses shared utility functions located in `src/utils/api.ts`:

- `successResponse<T>(data: T, status = 200)` - Create a success response
- `paginatedResponse<T>(data: T[], page, limit, total, status = 200)` - Create a paginated response
- `errorResponse(message: string, status = 400)` - Create an error response
- `notFoundResponse(resource: string)` - Create a 404 not found response
- `getPaginationParams(searchParams: URLSearchParams)` - Parse pagination parameters from URL
- `paginateArray<T>(arr: T[], skip: number, limit: number)` - Paginate an array

### Data Source

All endpoints currently use mock data from JSON files:

- Products: `/src/mock/small/products.json`
- Users: `/src/mock/small/users.json`
- Orders: `/src/mock/small/orders.json`

### Error Handling

All endpoints include try-catch error handling and return appropriate HTTP status codes:

- `200` - Success
- `404` - Resource not found
- `500` - Internal server error

---

## Testing the API

You can test the API endpoints using curl:

```bash
# Test products endpoint
curl "http://localhost:3000/api/products?page=1&limit=5"

# Test search
curl "http://localhost:3000/api/products?search=bike"

# Test single product
curl "http://localhost:3000/api/products/0e5e5900-29dd-46d6-af40-f8be36445b81"

# Test users
curl "http://localhost:3000/api/users?limit=5"

# Test orders with filtering
curl "http://localhost:3000/api/orders?userId=ebfc5306-7876-41f2-9979-eb0d1cbcc87d"
```

Or use tools like:

- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)
