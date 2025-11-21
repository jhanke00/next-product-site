# Learning Resources API - Backend Documentation

## Overview

The Learning Resources API provides CRUD (Create, Read, Update, Delete) operations for managing learning resources associated with products. The API follows RESTful conventions and uses Next.js App Router API routes.

## Base URL

All endpoints are prefixed with `/api/learning-resources`

## Data Model

### LearningResource

```typescript
{
  id: string;
  productId: string;
  title: string;
  description: string;
  url: string;
  type: 'guide' | 'tutorial' | 'video' | 'documentation';
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}
```

## Endpoints

### GET /api/learning-resources

Get all learning resources or filter by product ID.

**Query Parameters:**

- `productId` (optional, string): Filter resources by product ID

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "lr-001",
      "productId": "0e5e5900-29dd-46d6-af40-f8be36445b81",
      "title": "Getting Started Guide",
      "description": "A comprehensive guide...",
      "url": "https://example.com/guides/getting-started",
      "type": "guide",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "count": 1
}
```

**Example Requests:**

```bash
# Get all resources
GET /api/learning-resources

# Get resources for a specific product
GET /api/learning-resources?productId=0e5e5900-29dd-46d6-af40-f8be36445b81
```

### POST /api/learning-resources

Create a new learning resource.

**Request Body:**

```json
{
  "productId": "0e5e5900-29dd-46d6-af40-f8be36445b81",
  "title": "Getting Started Guide",
  "description": "A comprehensive guide...",
  "url": "https://example.com/guides/getting-started",
  "type": "guide"
}
```

**Required Fields:**

- `productId` (string)
- `title` (string)
- `url` (string)
- `type` (string): Must be one of: 'guide', 'tutorial', 'video', 'documentation'

**Optional Fields:**

- `description` (string)

**Response (201 Created):**

```json
{
  "data": {
    "id": "lr-1234567890-abc123",
    "productId": "0e5e5900-29dd-46d6-af40-f8be36445b81",
    "title": "Getting Started Guide",
    "description": "A comprehensive guide...",
    "url": "https://example.com/guides/getting-started",
    "type": "guide",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Missing required fields or invalid type
- `500 Internal Server Error`: Server error

### GET /api/learning-resources/[id]

Get a single learning resource by ID.

**Response (200 OK):**

```json
{
  "data": {
    "id": "lr-001",
    "productId": "0e5e5900-29dd-46d6-af40-f8be36445b81",
    "title": "Getting Started Guide",
    "description": "A comprehensive guide...",
    "url": "https://example.com/guides/getting-started",
    "type": "guide",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

**Error Responses:**

- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### PUT /api/learning-resources/[id]

Update an existing learning resource.

**Request Body:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "url": "https://example.com/updated-url",
  "type": "tutorial"
}
```

All fields are optional. Only provided fields will be updated.

**Response (200 OK):**

```json
{
  "data": {
    "id": "lr-001",
    "productId": "0e5e5900-29dd-46d6-af40-f8be36445b81",
    "title": "Updated Title",
    "description": "Updated description",
    "url": "https://example.com/updated-url",
    "type": "tutorial",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T11:00:00Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid type value
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### DELETE /api/learning-resources/[id]

Delete a learning resource.

**Response (200 OK):**

```json
{
  "message": "Learning resource deleted successfully"
}
```

**Error Responses:**

- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Implementation Details

### Utility Functions

The API routes use utility functions located in `/src/utils/learning-resources/index.ts`:

- `getLearningResourcesByProductId(productId: string)`: Get resources for a product
- `getLearningResourceById(id: string)`: Get a single resource
- `createLearningResource(input)`: Create a new resource
- `updateLearningResource(id, input)`: Update a resource
- `deleteLearningResource(id)`: Delete a resource
- `getAllLearningResources()`: Get all resources

### Data Storage

Currently, the API uses in-memory storage (array-based). In a production environment, this should be replaced with a proper database (e.g., PostgreSQL, MongoDB).

The initial data is loaded from:

- `/src/mock/small/learning-resources.json`
- `/src/mock/large/learning-resources.json`

## Testing

### Using cURL

```bash
# Get all resources for a product
curl http://localhost:3000/api/learning-resources?productId=0e5e5900-29dd-46d6-af40-f8be36445b81

# Create a new resource
curl -X POST http://localhost:3000/api/learning-resources \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "0e5e5900-29dd-46d6-af40-f8be36445b81",
    "title": "Test Guide",
    "description": "Test description",
    "url": "https://example.com/test",
    "type": "guide"
  }'

# Get a specific resource
curl http://localhost:3000/api/learning-resources/lr-001

# Update a resource
curl -X PUT http://localhost:3000/api/learning-resources/lr-001 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'

# Delete a resource
curl -X DELETE http://localhost:3000/api/learning-resources/lr-001
```

### Using Browser/Postman

1. Start the development server: `pnpm dev`
2. Navigate to `http://localhost:3000`
3. Use the browser's developer tools or Postman to test the endpoints

## Error Handling

All endpoints include proper error handling:

- Validation errors return `400 Bad Request` with descriptive messages
- Not found errors return `404 Not Found`
- Server errors return `500 Internal Server Error`

## Future Improvements

- Add authentication/authorization
- Implement rate limiting
- Add pagination for large result sets
- Add filtering and sorting options
- Replace in-memory storage with a database
- Add input sanitization and validation
- Add request logging
