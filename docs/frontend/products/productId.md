# ProductDetail Component

Displays detailed information about a product fetched from an internal API route.

## Summary

- **Rendering**: Server-side rendered (SSR) component.
- **Route**: `/products/[productId]`
- **Dynamic Route**: Receives `productId` from route params.
- **Data Fetching**: Calls `/api/products/:productId` using the current request host and protocol.
- **Error Handling**:
  - Renders "Product not found" on 404.
  - Renders a generic error message on other failures.
- **Rendering**: Shows product name, price, description, category, rating, number of reviews, and stock.

## Notes

- Uses `next/headers` to dynamically resolve the host.
- Assumes a `Product` type from `@type/products`.
