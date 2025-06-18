# Products API Documentation

This document describes the available endpoints in the Products API of the Next.js App Router project. All endpoints return JSON responses.

---

## Base URL

```
/api/products
```

---

## Endpoints

### 1. `GET /api/products`

Retrieve a paginated list of products.

#### Query Parameters

| Parameter | Type   | Description                  | Default |
| --------- | ------ | ---------------------------- | ------- |
| `offset`  | Number | Number of products to skip   | `0`     |
| `limit`   | Number | Number of products to return | `20`    |

#### Example Request

```
GET /api/products?offset=0&limit=10
```

#### Response

- **Status Code**: `200 OK`
- **Content-Type**: `application/json`

```json
{
  "products": [
    {
      "id": "clx123...",
      "name": "Product 1",
      ...
    },
    ...
  ],
  "total": 100,
  "offset": 0,
  "limit": 10
}
```

#### Error Responses

- `500 Internal Server Error`: If something goes wrong on the server.

---

### 2. `GET /api/products/:productId`

Retrieve details of a single product by ID.

#### Path Parameters

| Parameter   | Type   | Description          |
| ----------- | ------ | -------------------- |
| `productId` | String | Unique ID of product |

#### Example Request

```
GET /api/products/clx123...
```

#### Response

- **Status Code**: `200 OK`
- **Content-Type**: `application/json`

```json
{
  "id": "clx123...",
  "name": "Product 1",
  ...
}
```

#### Error Responses

- `404 Not Found`: If the product does not exist.
- `500 Internal Server Error`: If something goes wrong on the server.

---

## Notes

- All responses use appropriate HTTP status codes and reason phrases.
- Prisma ORM is used to interact with the database.
- Pagination is supported for performance and scalability.
