# Products Component

Client-side React component that displays a paginated list of products fetched from an API.

## Summary

- **Rendering**: Client-side rendered component.
- **Route**: `/products`
- **Pagination**:
  - Displays 20 products per page (`PAGE_SIZE`).
  - Supports "Previous" and "Next" buttons.
  - Scrolls to top on page change.
- **Data Fetching**:
  - Calls `/api/products?offset=X&limit=20` based on current page.
  - Uses `useEffect` for API calls and pagination effects.
- **UI States**:
  - Shows loading message while fetching.
  - Shows error message on failure.
  - Displays product cards on success with links to individual product pages.
- **Rendering**:
  - Each product card includes name, price, description, category, rating, reviews, and stock.

## Notes

- Uses `ProductsResponse` type from `@type/products`.
- Intended to run in the browser (`'use client'` directive).
- Product links navigate to `/products/:productId`.
