# API Endpoints Documentation

This document provides detailed documentation for all API endpoints in the Next.js Product Site.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: Depends on deployment

All endpoints return JSON responses unless otherwise specified.

## Products API

### List All Products

**Endpoint**: `GET /api/products`

**Description**: Retrieves all products from the catalog.

**Parameters**: None

**Response**:

```json
[
  {
    "id": 1,
    "name": "Aclonifen",
    "price": 89.99,
    "description": "Active ingredients for pharmaceutical applications",
    "category": "Active Ingredients",
    "rating": 4.8,
    "numReviews": 124,
    "countInStock": 50,
    "imageUrl": "/media/bayer.png"
  }
]
```

**Status Codes**:

- `200`: Success
- `500`: Server error

**Example**:

```bash
curl -X GET http://localhost:3000/api/products
```

---

### Get Product by ID

**Endpoint**: `GET /api/products/[id]`

**Description**: Retrieves a specific product by ID.

**Parameters**:

- `id` (path): Product ID (number)

**Response**:

```json
{
  "id": 1,
  "name": "Aclonifen",
  "price": 89.99,
  "description": "Active ingredients for pharmaceutical applications",
  "category": "Active Ingredients",
  "rating": 4.8,
  "numReviews": 124,
  "countInStock": 50,
  "imageUrl": "/media/bayer.png"
}
```

**Status Codes**:

- `200`: Success
- `404`: Product not found
- `500`: Server error

**Example**:

```bash
curl -X GET http://localhost:3000/api/products/1
```

## Learning Resources API

### List All Learning Resources

**Endpoint**: `GET /api/learning-resources`

**Description**: Retrieves all learning resources (training modules and tutorials).

**Parameters**: None

**Response**:

```json
[
  {
    "id": "resource-1234567890",
    "title": "Advanced Chemical Safety",
    "description": "Comprehensive safety training for chemical handling",
    "type": "training",
    "duration": "45 minutes",
    "files": [
      {
        "id": "file-1234567890-0",
        "name": "videoplayback-1.mp4",
        "url": "/media/videoplayback-1.mp4",
        "type": "video"
      }
    ],
    "createdAt": "2025-01-27T10:00:00.000Z"
  }
]
```

**Status Codes**:

- `200`: Success
- `500`: Server error

**Example**:

```bash
curl -X GET http://localhost:3000/api/learning-resources
```

---

### Create Learning Resource

**Endpoint**: `POST /api/learning-resources`

**Description**: Creates a new learning resource with automatic file assignment.

**Request Body**:

```json
{
  "title": "Chemical Safety Training",
  "description": "Essential safety protocols for chemical handling",
  "type": "training",
  "duration": "30 minutes",
  "files": [
    {
      "type": "video"
    }
  ]
}
```

**Required Fields**:

- `title` (string): Resource title
- `description` (string): Resource description
- `type` (string): Either "training" or "tutorial"
- `files` (array): Array of file objects with type

**Optional Fields**:

- `duration` (string): Duration description

**Response**:

```json
{
  "id": "resource-1234567890",
  "title": "Chemical Safety Training",
  "description": "Essential safety protocols for chemical handling",
  "type": "training",
  "duration": "30 minutes",
  "files": [
    {
      "id": "file-1234567890-0",
      "name": "videoplayback-2.mp4",
      "url": "/media/videoplayback-2.mp4",
      "type": "video"
    }
  ],
  "createdAt": "2025-01-27T10:00:00.000Z"
}
```

**Status Codes**:

- `201`: Created successfully
- `400`: Validation error
- `500`: Server error

**Automatic File Assignment**:

- **Training**: Assigns video files cyclically (`videoplayback-1.mp4`, `videoplayback-2.mp4`, `videoplayback-3.mp4`)
- **Tutorial**: Assigns PDF files cyclically (`pdf-1.pdf`, `pdf-2.pdf`, `pdf-3.pdf`)

**Example**:

```bash
curl -X POST http://localhost:3000/api/learning-resources \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Safety Training",
    "description": "Basic safety protocols",
    "type": "training",
    "files": [{"type": "video"}]
  }'
```

---

### Delete Learning Resource

**Endpoint**: `DELETE /api/learning-resources/[id]`

**Description**: Deletes a learning resource and removes it from all product assignments (cascade delete).

**Parameters**:

- `id` (path): Resource ID (string)

**Response**:

```json
{
  "message": "Resource deleted successfully and removed from all product assignments",
  "resource": {
    "id": "resource-1234567890",
    "title": "Chemical Safety Training",
    "type": "training"
  }
}
```

**Status Codes**:

- `200`: Deleted successfully
- `400`: Missing resource ID
- `404`: Resource not found
- `500`: Server error

**Cascade Delete Behavior**:

1. Removes resource from learning resources collection
2. Scans all product assignments
3. Removes resource ID from assignment arrays
4. Updates assignment files only if changes were made
5. Operation is atomic (all succeed or all fail)

**Example**:

```bash
curl -X DELETE http://localhost:3000/api/learning-resources/resource-1234567890
```

## Product Assignments API

### Get Product Assignments

**Endpoint**: `GET /api/products/[id]/assignments`

**Description**: Retrieves learning resources assigned to a specific product.

**Parameters**:

- `id` (path): Product ID (string)

**Response**:

```json
{
  "productId": 1,
  "assignedResources": ["resource-1234567890", "resource-0987654321"],
  "customGuide": "Special handling instructions for this product...",
  "updatedAt": "2025-01-27T10:00:00.000Z"
}
```

**Empty Assignment Response**:

```json
{
  "productId": 1,
  "assignedResources": [],
  "customGuide": "",
  "updatedAt": "2025-01-27T10:00:00.000Z"
}
```

**Status Codes**:

- `200`: Success (returns empty assignment if none exists)
- `400`: Invalid product ID
- `500`: Server error

**Example**:

```bash
curl -X GET http://localhost:3000/api/products/1/assignments
```

---

### Update Product Assignments

**Endpoint**: `PUT /api/products/[id]/assignments`

**Description**: Updates learning resource assignments for a product.

**Parameters**:

- `id` (path): Product ID (string)

**Request Body**:

```json
{
  "assignedResources": ["resource-1234567890", "resource-0987654321"],
  "customGuide": "Updated handling instructions..."
}
```

**Required Fields**:

- `assignedResources` (array): Array of resource IDs

**Optional Fields**:

- `customGuide` (string): Custom instructions for the product

**Response**:

```json
{
  "productId": 1,
  "assignedResources": ["resource-1234567890", "resource-0987654321"],
  "customGuide": "Updated handling instructions...",
  "updatedAt": "2025-01-27T10:00:00.000Z"
}
```

**Status Codes**:

- `200`: Updated successfully
- `400`: Validation error
- `500`: Server error

**Behavior**:

- Creates new assignment if none exists
- Updates existing assignment if found
- Validates that `assignedResources` is an array
- Automatically sets `updatedAt` timestamp

**Example**:

```bash
curl -X PUT http://localhost:3000/api/products/1/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "assignedResources": ["resource-1234567890"],
    "customGuide": "Handle with care"
  }'
```

## Health Check API

### System Health Check

**Endpoint**: `GET /api/health`

**Description**: Returns system health status for monitoring and Docker health checks.

**Parameters**: None

**Response**:

```json
{
  "status": "healthy",
  "timestamp": "2025-01-27T10:00:00.000Z",
  "version": "1.0.0"
}
```

**Status Codes**:

- `200`: System is healthy

**Example**:

```bash
curl -X GET http://localhost:3000/api/health
```

## Error Responses

All API endpoints follow a consistent error response format:

### Client Errors (4xx)

**400 Bad Request**:

```json
{
  "error": "Missing required fields: title, description, type, files"
}
```

**404 Not Found**:

```json
{
  "error": "Resource not found"
}
```

### Server Errors (5xx)

**500 Internal Server Error**:

```json
{
  "error": "Failed to create learning resource"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production deployment.

## Authentication

Currently, no authentication is required. All endpoints are publicly accessible.

## CORS

CORS is handled by Next.js default configuration. All origins are allowed in development.

## Content Types

- **Request**: `application/json` for POST/PUT requests
- **Response**: `application/json` for all responses

## File Upload

Currently, file upload is not supported. Files are automatically assigned based on resource type.

## Webhooks

No webhook functionality is currently implemented.

## API Versioning

No versioning is currently implemented. All endpoints are considered v1.

## Testing

Use the provided Jest tests to validate API functionality:

```bash
npm test __tests__/api/
```

## OpenAPI/Swagger

Consider adding OpenAPI specification for better API documentation and client generation.
