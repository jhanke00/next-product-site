# Backend API Overview

This document provides a comprehensive overview of the Next.js Product Site backend API architecture, endpoints, and data flow.

## Architecture

The backend follows a **file-based API architecture** using Next.js App Router with the following key components:

- **API Routes**: RESTful endpoints in `/app/api/`
- **Data Storage**: JSON files in `/src/data/`
- **Type Safety**: Centralized types in `/app/api/types.ts`
- **Utilities**: Shared functions in `/app/api/utils.ts`

## Core Concepts

### Data Models

The system manages three primary data entities:

1. **Products** - Core product catalog
2. **Learning Resources** - Training materials and tutorials
3. **Product Assignments** - Mappings between products and learning resources

### File-Based Storage

All data is stored in JSON files for simplicity:

```
src/data/
├── products.json           # Product catalog
├── learning-resources.json # Training materials
└── product-assignments.json # Product-resource mappings
```

### Type System

Centralized TypeScript types ensure consistency across all API endpoints:

- **Data Wrapper Types**: `ProductsData`, `LearningResourcesData`, `AssignmentsData`
- **Business Logic Types**: `ProductAssignment`, `HealthCheckResponse`
- **API Contract Types**: Request/Response interfaces
- **Constants**: File paths and configuration

## API Endpoints

### Products API

#### `GET /api/products`

- Returns all products from the catalog
- No authentication required
- Always returns fresh data (`cache: 'no-store'`)

#### `GET /api/products/[id]`

- Returns a specific product by ID
- Returns 404 if product not found
- Used for product detail pages

### Learning Resources API

#### `GET /api/learning-resources`

- Returns all learning resources (training modules and tutorials)
- Includes file attachments and metadata
- Used by LMS interface

#### `POST /api/learning-resources`

- Creates new learning resources
- **Automatic File Assignment**: Uses cyclical file assignment algorithm
- Validates required fields: `title`, `description`, `type`, `files`
- Supports types: `training` (video files) or `tutorial` (PDF files)

#### `DELETE /api/learning-resources/[id]`

- Deletes a learning resource by ID
- **Cascade Delete**: Automatically removes resource from all product assignments
- Returns deleted resource information
- Atomic operation (all or nothing)

### Product Assignments API

#### `GET /api/products/[id]/assignments`

- Returns learning resources assigned to a specific product
- Includes custom guide text
- Returns empty assignment if none exists

#### `PUT /api/products/[id]/assignments`

- Updates learning resource assignments for a product
- Creates new assignment if none exists
- Validates `assignedResources` array
- Supports custom guide text

### Health Check API

#### `GET /api/health`

- System health check endpoint
- Returns status, timestamp, and version
- Used by Docker health checks and monitoring

## Data Flow

### Creating Learning Resources

1. **Request Validation**: Check required fields and type
2. **File Assignment**: Automatically assign media files using cyclical algorithm
3. **Data Persistence**: Save to `learning-resources.json`
4. **Response**: Return created resource with generated ID and files

### Assigning Resources to Products

1. **Product Validation**: Verify product exists
2. **Resource Validation**: Check all assigned resources exist
3. **Assignment Update**: Create or update product assignment
4. **Data Persistence**: Save to `product-assignments.json`

### Deleting Resources (Cascade)

1. **Resource Lookup**: Find resource by ID
2. **Assignment Cleanup**: Remove from all product assignments
3. **Resource Deletion**: Remove from resources collection
4. **Atomic Save**: Update both files or rollback on error

## File Operations

### Data Access Layer

The `utils.ts` file provides a centralized data access layer:

```typescript
// Generic file operations
readJsonFile<T>(filePath, defaultValue);
writeJsonFile<T>(filePath, data);

// Specific data operations
readResourcesData();
writeResourcesData(data);
readProductsData();
writeProductsData(data);
readAssignmentsData();
writeAssignmentsData(data);
```

### Error Handling

- **File Read Errors**: Return default empty data structure
- **File Write Errors**: Throw exceptions to prevent data corruption
- **Validation Errors**: Return 400 status with descriptive messages
- **Not Found Errors**: Return 404 status
- **Server Errors**: Return 500 status with generic error message

## Features

### Cyclical File Assignment

Learning resources automatically receive appropriate media files:

- **Training Modules**: Get video files (`videoplayback-1.mp4`, `videoplayback-2.mp4`, `videoplayback-3.mp4`)
- **Tutorials**: Get PDF files (`pdf-1.pdf`, `pdf-2.pdf`, `pdf-3.pdf`)
- **Algorithm**: Cycles through available files based on existing resource count

### Cascade Deletion

When a learning resource is deleted:

1. Resource is removed from the main collection
2. All product assignments are scanned
3. Resource ID is removed from assignment arrays
4. Assignment files are updated only if changes were made
5. Operation is atomic (all succeed or all fail)

### Data Integrity

- **Referential Integrity**: Assignments reference valid resource IDs
- **Orphan Detection**: Missing resources are logged during product page load
- **Atomic Operations**: Multi-file updates are consistent
- **Validation**: All inputs are validated before processing

## Performance Considerations

### Caching Strategy

- **No Server-Side Caching**: Always read fresh data from files
- **Client-Side Fresh Data**: All fetches use `cache: 'no-store'`
- **Rationale**: Ensures data consistency in file-based system

### File I/O Optimization

- **Minimal File Operations**: Only read/write when necessary
- **Batch Updates**: Group related changes together
- **Error Recovery**: Graceful handling of file system errors

## Security

### Input Validation

- **Type Checking**: All inputs validated against TypeScript interfaces
- **Required Fields**: Enforced at API level
- **Sanitization**: Text inputs are trimmed
- **Array Validation**: Assignment arrays verified

### Error Information

- **Development**: Detailed error logging to console
- **Production**: Generic error messages to clients
- **No Sensitive Data**: File paths and internal details not exposed

## Monitoring

### Health Checks

- **Endpoint**: `/api/health`
- **Docker Integration**: Used in container health checks
- **Response Format**: Status, timestamp, version
- **Monitoring Ready**: Can be extended for system checks

### Logging

- **Error Logging**: All errors logged to console
- **Operation Logging**: Key operations logged for debugging
- **Request Tracing**: Each API call can be traced through logs

## Future Improvements

### Database Migration

The current file-based system can be easily migrated to a database:

1. **Type Compatibility**: Existing types work with database schemas
2. **Service Layer**: Utils can be replaced with database queries
3. **API Compatibility**: Endpoints remain unchanged
4. **Data Migration**: JSON files can be imported directly

### Authentication

- Add authentication middleware to protect write operations
- Implement role-based access control
- Add user tracking for resource creation/modification

### Validation

- Add JSON schema validation for more complex data structures
- Implement business rule validation
- Add cross-entity validation

### Performance

- Implement caching for read-heavy operations
- Add database indexing when migrating
- Implement pagination for large datasets
