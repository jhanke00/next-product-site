# Products API Documentation

## Overview

The Products API provides endpoints to retrieve the products.

## Base URL

/api/products

## Endpoints Overview

| Method | Endpoint        | Description                                                 |
| ------ | --------------- | ----------------------------------------------------------- |
| GET    | `/api/products` | Retrieve a list of products (optionally filtered by query). |

## 1. GET /api/products

Retrieve all products or filter by a search term.

### Query Parameters

| Name | Type   | Required | Description                         |
| ---- | ------ | -------- | ----------------------------------- |
| `q`  | string | No       | Filter products by name or category |

### Example

```http
GET /api/products?q=tools
```

```json
[
  {
    "id": "cedfa1ce-568d-4431-8299-e8a22570094e",
    "name": "Oriental Concrete Shoes",
    "price": "377.00",
    "description": "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients",
    "category": "Tools",
    "rating": 0.805932201910764,
    "numReviews": 47,
    "countInStock": 29
  }
]
```
