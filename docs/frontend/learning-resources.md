# Learning Resources Feature - Frontend Documentation

## Overview

The Learning Resources feature allows users to view and manage learning resources (guides, tutorials, videos, and documentation) associated with products. This feature is integrated into the product detail page, providing a seamless way to access educational content for each product.

## Components

### LearningResourcesSection

**Location:** `/src/components/learning-resources/LearningResourcesSection.tsx`

Main wrapper component that combines the list and form components. Manages the refresh state when new resources are added.

**Props:**

- `productId` (string): The ID of the product to display resources for

### LearningResourcesList

**Location:** `/src/components/learning-resources/LearningResourcesList.tsx`

Displays a list of learning resources for a specific product. Includes:

- Resource type icons (📖 guide, 🎓 tutorial, 🎥 video, 📚 documentation)
- Resource title, description, and URL
- Delete functionality
- Loading and error states

**Props:**

- `productId` (string): The ID of the product to fetch resources for

**Features:**

- Fetches resources from `/api/learning-resources?productId={productId}`
- Displays empty state when no resources are available
- Handles delete operations with confirmation
- Auto-refreshes after deletion

### AddLearningResourceForm

**Location:** `/src/components/learning-resources/AddLearningResourceForm.tsx`

Form component for adding new learning resources. Includes:

- Title input (required)
- Description textarea (optional)
- URL input (required)
- Type selector (guide, tutorial, video, documentation)
- Submit and cancel buttons

**Props:**

- `productId` (string): The ID of the product to associate the resource with
- `onSuccess` (function, optional): Callback function called after successful creation

**Form Fields:**

- `title`: Resource title (required)
- `description`: Resource description (optional)
- `url`: Resource URL (required, must be valid URL)
- `type`: Resource type - one of: 'guide', 'tutorial', 'video', 'documentation' (required)

## Integration

The Learning Resources feature is integrated into the product detail page at `/app/products/[productId]/page.tsx`. The `LearningResourcesSection` component is rendered below the product information.

## Usage

```tsx
import LearningResourcesSection from '@/src/components/learning-resources/LearningResourcesSection';

// In your component
<LearningResourcesSection productId={productId} />;
```

## Styling

The components use Tailwind CSS classes and follow the existing design system:

- Dark mode support
- Responsive design
- Hover states and transitions
- Consistent spacing and typography

## Testing

To test the Learning Resources feature:

1. Navigate to any product detail page (e.g., `/products/{productId}`)
2. Scroll down to see the "Learning Resources" section
3. Click "+ Add Learning Resource" to add a new resource
4. Fill in the form and submit
5. Verify the new resource appears in the list
6. Test the delete functionality by clicking "Delete" on any resource
7. Verify the resource is removed from the list

## API Integration

The frontend components communicate with the following API endpoints:

- `GET /api/learning-resources?productId={productId}` - Fetch resources for a product
- `POST /api/learning-resources` - Create a new resource
- `DELETE /api/learning-resources/{id}` - Delete a resource

See the [Backend API Documentation](../backend/learning-resources-api.md) for more details.
