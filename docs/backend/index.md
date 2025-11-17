# Backend

Documentation on any Backend capabilities or changes made.

## Learning Resources API

A comprehensive RESTful API for managing learning resources associated with products. This API enables CRUD operations on learning content and supports both individual resource management and product-based bulk operations.

### Overview

The Learning Resources API provides three main endpoints:

- `/api/learning` - Collection-level operations
- `/api/learning/[resourceId]` - Individual resource operations
- `/api/learning/product/[productId]` - Product-based resource operations

### Data Model

#### LearningContent Type

```typescript
type LearningContent = {
  resourceId: string;
  productId: number;
  name: string;
  description: string;
  resourceURI: string;
  popularityScore: number;
};
```

#### ProductResource Type

```typescript
type ProductResource = {
  productId: string;
  resourceId: string;
  name: string;
  description: string;
  resourceURI: string;
  popularityScore: number;
};
```

### API Endpoints

#### Collection Operations

##### GET `/api/learning`

Retrieves all learning resources from both small and large mock data files.

**Response:**

```json
{
  "data": [
    {
      "resourceId": "learn-001",
      "productId": "prod-123",
      "name": "Getting Started Guide",
      "description": "A comprehensive guide to get you started",
      "resourceURI": "https://example.com/getting-started",
      "popularityScore": 95
    }
  ]
}
```

**Status Codes:**

- `200` - Success

##### POST `/api/learning`

Creates a new learning resource in the small data file.

**Request Body:**

```json
{
  "resourceId": "learn-005",
  "productId": "prod-789",
  "name": "API Reference",
  "description": "Complete API documentation",
  "resourceURI": "https://example.com/api-reference",
  "popularityScore": 92
}
```

**Response:**

```json
{
  "message": "Resource added successfully"
}
```

**Status Codes:**

- `201` - Resource created successfully
- `500` - Failed to add resource (invalid JSON or write error)

#### Individual Resource Operations

##### GET `/api/learning/[resourceId]`

Retrieves a specific learning resource by its ID.

**Response:**

```json
{
  "data": {
    "resourceId": "learn-001",
    "productId": "prod-123",
    "name": "Getting Started Guide",
    "description": "A comprehensive guide to get you started",
    "resourceURI": "https://example.com/getting-started",
    "popularityScore": 95
  }
}
```

**Status Codes:**

- `200` - Success (returns `null` in data field if resource not found)

##### PUT `/api/learning/[resourceId]`

Updates an existing learning resource. Supports partial updates.

**Request Body:**

```json
{
  "name": "Updated Getting Started Guide",
  "popularityScore": 98
}
```

**Response:**

```json
{
  "message": "Resource updated successfully"
}
```

**Status Codes:**

- `200` - Resource updated successfully
- `404` - Resource not found
- `500` - Failed to update resource (invalid JSON or write error)

**Notes:**

- Searches small file first, then large file
- **Modifies the file where the resource is found** (either small or large)
- Preserves unchanged fields during partial updates

##### DELETE `/api/learning/[resourceId]`

Deletes a specific learning resource.

**Response:**

```json
{
  "message": "Resource deleted successfully"
}
```

**Status Codes:**

- `200` - Resource deleted successfully
- `404` - Resource not found
- `500` - Failed to delete resource

**Notes:**

- Searches small file first, then large file
- **Removes the resource from whichever file contains it** (either small or large)

#### Product-Based Operations

##### GET `/api/learning/product/[productId]`

Retrieves all learning resources associated with a specific product.

**Features:**

- Combines data from both small and large files
- Deduplicates resources by `resourceId` (small file takes precedence)

**Response:**

```json
{
  "data": [
    {
      "resourceId": "learn-001",
      "productId": "prod-123",
      "name": "Getting Started Guide",
      "description": "A comprehensive guide to get you started",
      "resourceURI": "https://example.com/getting-started",
      "popularityScore": 95
    },
    {
      "resourceId": "learn-003",
      "productId": "prod-123",
      "name": "Advanced Guide",
      "description": "Advanced guide from large dataset",
      "resourceURI": "https://example.com/advanced-guide",
      "popularityScore": 90
    }
  ]
}
```

**Status Codes:**

- `200` - Success (returns empty array if no resources found)

##### PUT `/api/learning/product/[productId]`

Replaces all learning resources for a specific product.

**Behavior:**

- Removes all existing resources for the product from the small file
- Adds the new resources to the small file
- Does not affect the large file

**Request Body:**

```json
[
  {
    "resourceId": "learn-010",
    "productId": "prod-123",
    "name": "New Resource 1",
    "description": "First new resource",
    "resourceURI": "https://example.com/new1",
    "popularityScore": 85
  }
]
```

**Response:**

```json
{
  "message": "Resources updated successfully"
}
```

**Status Codes:**

- `200` - Resources updated successfully
- `500` - Failed to update resources (invalid JSON or write error)

##### DELETE `/api/learning/product/[productId]`

Deletes all learning resources associated with a specific product.

**Behavior:**

- Only removes resources from the small file
- Does not affect the large file

**Response:**

```json
{
  "message": "Resources deleted successfully"
}
```

**Status Codes:**

- `200` - Resources deleted successfully
- `404` - No resources found for this product
- `500` - Failed to delete resources

### Data Storage

The API uses a dual-file system for mock data storage:

#### Small Data File

- **Path:** `src/mock/small/learning.json`
- **Purpose:** Stores user-created and modified resources
- **Write Operations:** All POST, PUT, and DELETE operations modify this file
- **Priority:** Takes precedence in deduplication scenarios

#### Large Data File

- **Path:** `src/mock/large/learning.json`
- **Purpose:** Stores base/seed learning resources
- **Write Behavior:** Modified by PUT and DELETE operations when resource is found here (but not by POST)
- **Fallback:** Checked when resources are not found in small file

### Type Changes

#### Product Type Updates

The `Product` type has been enhanced to support learning resources:

**Previous:**

```typescript
type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
};
```

**Updated:**

```typescript
type Product = {
  id: string; // Changed from number to string
  name: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  learningResources?: ProductResource[]; // New optional field
};
```

**Key Changes:**

- `id` field changed from `number` to `string` for UUID support
- Added optional `learningResources` array field

### Error Handling

The API implements consistent error handling across all endpoints:

#### Error Response Format

```json
{
  "error": "Error message describing what went wrong"
}
```

#### Common Error Scenarios

1. **Invalid JSON** - Returns 500 with message about failed parsing
2. **File System Errors** - Returns 500 with details about read/write failures
3. **Resource Not Found** - Returns 404 with appropriate message
4. **Missing Required Fields** - Returns 500 with validation error

### Testing

The Learning Resources API has comprehensive test coverage including:

#### Unit Tests (`tests/api/learning.test.ts`)

- **Collection Operations:**
  - GET all resources (combining both files)
  - POST new resources
  - Handling empty data
  - Error scenarios

- **Individual Resource Operations:**
  - GET by resourceId (from both files)
  - PUT updates (partial and full)
  - DELETE operations
  - 404 scenarios

- **Product-Based Operations:**
  - GET resources by productId
  - PUT bulk updates
  - DELETE all product resources
  - Deduplication logic

- **Integration Scenarios:**
  - Full CRUD cycle
  - Cross-file operations
  - Data consistency

**Test Coverage:**

- Line Coverage: ~95%
- Branch Coverage: ~90%
- Statement Coverage: ~95%

### Usage Examples

#### Creating a New Learning Resource

```typescript
const response = await fetch('/api/learning', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resourceId: 'learn-new-001',
    productId: 'prod-123',
    name: 'Quick Start Guide',
    description: 'Get started in 5 minutes',
    resourceURI: 'https://example.com/quickstart',
    popularityScore: 88,
  }),
});
```

#### Updating a Resource

```typescript
const response = await fetch('/api/learning/learn-001', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    popularityScore: 99,
  }),
});
```

#### Getting All Resources for a Product

```typescript
const response = await fetch('/api/learning/product/prod-123');
const data = await response.json();
console.log(data.data); // Array of learning resources
```

### Future Enhancements

Potential improvements for the Learning Resources API:

1. **Database Integration** - Replace file-based storage with a proper database
2. **Pagination** - Add pagination support for large collections
3. **Filtering & Sorting** - Enable filtering by popularity, name, etc.
4. **Search** - Implement full-text search across resources
5. **Validation** - Add JSON schema validation for request bodies
6. **Rate Limiting** - Implement API rate limiting
7. **Authentication** - Add authentication and authorization
8. **Bulk Operations** - Support bulk create/update/delete operations
9. **Versioning** - Implement API versioning (v1, v2, etc.)
10. **Caching** - Add response caching for improved performance
