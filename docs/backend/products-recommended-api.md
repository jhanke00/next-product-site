# Products API Documentation

## Overview

Recommended products API provides endpoints to retrieve the recommended products.

## Base URL

/api/products/recommended

## Endpoints Overview

| Method | Endpoint                    | Description                                           |
| ------ | --------------------------- | ----------------------------------------------------- |
| GET    | `/api/products/recommended` | Retrieve a list of the first 51 recommended products. |

## 1. GET /api/products/recommended

Retrieve recommended products. Recommended products are filtered by **high ratings** and **availability in stock**.

### Example

```http
GET /api/products/recommended
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
