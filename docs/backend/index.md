# Backend

Documentation on any Backend capabilities or changes made.

## Overview

This API allows you to retrieve product information from a dataset. You can filter products by name or category, and paginate through the results.

## Endpoints

### 1. Get All Products with Pagination

**`GET /api/{dataset}/products`**

Retrieves a list of paginated products based on optional query and category filters.

#### Request Parameters:

- **`dataset`** (required): Dataset type (`'small'` or `'large'`).
- **`query`** (optional): Search term to filter products by name (case-insensitive).
- **`category`** (optional): Category to filter products (case-insensitive).
- **`page`** (optional): Page number for pagination (default: `1`).
- **`productsPerPage`** (optional): Number of products per page (default: `10`).

#### Response:

- **Status Code**: `200 OK`
  - Returns a JSON object containing paginated products:

```
{
  "products": [
    {
      "id": "1",
      "name": "Running Shoes",
      "category": "sports",
      "price": "100.0",
      "description": "High-quality running shoes.",
      "rating": 4.5,
      "numReviews": 10,
      "countInStock": 15
    },
    {...}
  ],
  "count": 50,
  "page": 2,
  "pages": 5
}
```

- **Status Code**: `405 Method Not Allowed`
  - If the request method is not `GET`.
- **Status Code**: `500 Internal Server Error`
  - For unexpected errors.

#### Example Request:

```
GET /api/small/products?query=shoes&category=sports&page=2&productsPerPage=5
```

#### Error Responses:

- **400 Bad Request**: If the dataset is invalid or required parameters are missing.
- **404 Not Found**: If no products match the filters.

#### Example Error Response:

```
{
  "error": "Invalid dataset"
}
```

### 2. Get Product by ID

**`GET /api/{dataset}/products/{id}`**

Retrieves detailed information about a specific product using its unique ID.

#### Request Parameters:

- **`dataset`** (required): Dataset type (`'small'` or `'large'`).
- **`id`** (required): Unique identifier of the product.

#### Response:

- **Status Code**: `200 OK`
  - Returns a JSON object containing product details:

```
{
  "id": "1",
  "name": "Running Shoes",
  "category": "sports",
  "price": "100.0",
  "description": "High-quality running shoes.",
  "rating": 4.5,
  "numReviews": 10,
  "countInStock": 15
}
```

- **Status Code**: `404 Not Found`
  - If the product with the specified ID does not exist.

#### Example Request:

```
GET /api/small/products/1
```

#### Error Responses:

- **400 Bad Request**: If the dataset is invalid.
- **404 Not Found**: If the product ID does not exist.

#### Example Error Response:

```
{
  "error": "Product not found"
}
```
