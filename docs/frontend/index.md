# Frontend

Documentation on Frontend capabilities and changes made to the product interface.

## Products Listing Page

### Core Features

**Displaying All Products from Mock Data:**
We have implemented a feature that enables the display of all products available in our mock data. Users can now easily browse through the entire product catalog, providing them with a comprehensive view of our offerings.

**Pagination for Improved Navigation:**
To enhance user experience and prevent issues associated with infinite scrolling, we have introduced pagination functionality. Users can now navigate through the product list more efficiently by moving between different pages (20 products per page), allowing for smoother and more organized browsing.

### Product Information Displayed

Each product card shows:

- Product name
- Price
- Description
- Category
- Rating (out of 5 stars)
- Number of reviews
- Stock availability

### Storybook Integration

Added comprehensive Storybook stories for the products listing page (`app/products/products.stories.tsx`):

**Stories Created:**

- `Default` - Shows the initial page with 20 products
- `PaginationControls` - Tests pagination button states
- `NavigateToNextPage` - Validates page navigation functionality
- `ProductLinks` - Verifies all product information is displayed correctly
- `DisplaysMultipleProducts` - Confirms proper page size and pagination info

**Interactive Testing:**

- Uses `@storybook/test` for automated play functions
- Simulates user interactions with `userEvent`
- Validates DOM assertions with Testing Library matchers

## Products Detail Page

### Core Features

**Single Page Product Details:**
We have introduced a feature that offers detailed product descriptions on a single page. Users can now access comprehensive information about each product, including specifications, pricing, and additional details, all in one centralized location.

**Learning Resources Management:**
The product details page now includes an interactive learning resources panel that allows users to:

- View all learning resources associated with a product
- Sort resources by popularity score (highest first)
- Add new learning resources via a dialog form
- Delete existing resources
- See real-time updates after CRUD operations

### Product Details Display

The details page shows:

- Product name and ID
- Price (formatted to 2 decimal places)
- Full description
- Category
- Rating and review count
- Stock availability
- Learning resources panel (expandable)

### Learning Resources Panel

**Features:**

- Collapsible side panel showing resource count in badge
- Resources sorted by popularity score (descending)
- Each resource displays:
  - Name (as clickable link to `resourceURI`)
  - Description
  - Popularity score
  - Delete button
- Add new resource button
- Empty state message when no resources exist

**Add Resource Dialog:**
Modal form for creating new learning resources with fields for:

- Name (required)
- Description (optional)
- URL/resourceURI (required)
- Auto-generated UUID for resourceId
- Default popularity score of 50

**API Integration:**

- `POST /api/learning` - Create new resource
- `DELETE /api/learning/[resourceId]` - Remove resource
- `GET /api/learning/product/[productId]` - Fetch all product resources
- Real-time UI updates after successful operations

### Component Structure

The product details page uses a client-side component (`productdetails.tsx`) that:

- Manages local state for resources and loading states
- Uses React hooks (useState, useEffect, useRef, useMemo)
- Implements sorted resources via useMemo for performance
- Handles form submissions and API calls
- Provides user feedback during async operations

### Storybook Integration

Added comprehensive Storybook stories for product details (`app/products/[productId]/productdetails.stories.tsx`):

**Stories Created:**

- `Default` - Shows product with learning resources
- `WithLearningResourcesOpen` - Demonstrates expanded resources panel
- `NoLearningResources` - Tests empty state handling
- `AddResourceDialog` - Validates the add resource form

**Mock Data:**

- Includes realistic product examples with and without resources
- Uses UUID-based product IDs
- Demonstrates various interaction states

### Testing Coverage

Comprehensive test suite created in `tests/app/products/productdetails.test.tsx`:

**Test Categories:**

- Component rendering with and without resources
- Learning resources panel interaction
- Dialog open/close functionality
- Add resource form submission and validation
- Delete resource functionality
- API integration (mocked)
- Error handling
- Loading states
- Empty states

**Testing Tools:**

- React Testing Library for component testing
- `@testing-library/user-event` for interaction simulation
- `@testing-library/jest-dom` for DOM assertions
- Mocked fetch API and crypto.randomUUID
- Mocked HTMLDialogElement methods

## Folder Structure

### Component Files

- `app/products/layout.tsx` - Product page layout
- `app/products/page.tsx` - Product listing page
- `app/products/[productId]/page.tsx` - Product details page (server component)
- `app/products/[productId]/productdetails.tsx` - Product details client component

### Storybook Files

- `app/products/products.stories.tsx` - Product listing stories
- `app/products/[productId]/productdetails.stories.tsx` - Product details stories

### Test Files

- `tests/app/products/products.test.tsx` - Product listing tests
- `tests/app/products/productdetails.test.tsx` - Product details tests

### Mock Data

- `src/mock/small/products.json` - Small dataset (50 products)
- `src/mock/large/products.json` - Large dataset (10k products)
- `src/mock/small/learning.json` - Small learning resources dataset
- `src/mock/large/learning.json` - Large learning resources dataset

## Type Definitions

### Product Type (`src/type/products/index.ts`)

```typescript
type Product = {
  id: string; // UUID format
  name: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  learningResources?: ProductResource[]; // Optional array
};
```

**Changes from Main Branch:**

- `id` field changed from `number` to `string` (UUID)
- Added optional `learningResources` field

### ProductResource Type

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

## Recent Changes Since Main Branch

### Storybook Enhancements

- Added multiple interactive stories for products listing
- Created comprehensive product details stories
- Implemented automated testing via play functions
- Added user interaction simulations

### Testing Infrastructure

- Created test suite for product listing page
- Added comprehensive product details component tests
- Integrated Testing Library for React testing
- Mocked API calls and browser APIs
- Achieved high test coverage

### Component Features

- Added learning resources management to product details
- Implemented collapsible side panel with resource list
- Created add/delete resource functionality
- Integrated with Learning Resources API
- Added sorting by popularity score
- Implemented loading and error states

### UI/UX Improvements

- Enhanced product cards with complete information
- Added pagination with page number display
- Implemented dialog-based resource creation
- Added real-time UI updates after API operations
- Included empty state messaging

## Development Workflow

### Running Storybook

```bash
# Start Storybook development server
pnpm storybook

# Access at http://localhost:6006
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test -- --coverage

# Run specific test file
pnpm test products.test.tsx
```

### Viewing Test Results in Storybook

The Storybook Jest addon displays test results directly in the Storybook UI:

1. Start Storybook: `pnpm storybook`
2. Navigate to any story
3. View test results in the "Tests" panel

## Future Enhancements

### Products Listing

1. **Filtering** - Add category and price range filters
2. **Sorting** - Enable sort by price, rating, name
3. **Search** - Implement product search functionality
4. **View Options** - Grid/list view toggle

### Product Details

1. **Image Gallery** - Add product images
2. **Reviews Section** - Display and add product reviews
3. **Related Products** - Show similar products
4. **Share Functionality** - Social sharing buttons
5. **Resource Editing** - Edit existing learning resources
6. **Bulk Operations** - Bulk add/delete resources
7. **Resource Categories** - Categorize learning resources
8. **Resource Preview** - Preview resource content before opening

### Learning Resources

1. **Popularity Tracking** - Track resource views/clicks
2. **User Ratings** - Allow users to rate resources
3. **Resource Types** - Support videos, PDFs, articles, etc.
4. **Resource Search** - Search within product resources
5. **Resource Comments** - Add commenting on resources
