# Frontend — Learning Resources

What I added

- A client React component `ResourcesClient` at `src/components/product-resources/ResourcesClient.tsx`.
- The component is rendered in the product detail page `app/products/[productId]/page.tsx`.
- A `BackButton` component was added (`src/components/BackButton.tsx`) and wired into product pages.

How it works

- `ResourcesClient` fetches learning resources from the app-route API `GET /api/products/:productId/resources` and allows adding via `POST`.
- The form uses a simple POST request; the API currently stores resources in-memory (initialized from `src/mock/small/learning-resources.json`).

How to test locally

1. Start the dev server:

   pnpm dev

2. Open a product list at http://localhost:3000/products and click a product.
3. On the product detail page, confirm the "Learning Resources" section appears and use the form to add a resource.

Notes

- The UI is intentionally minimal. If you want persistent storage, replace the in-memory API implementation with a DB or file-based store.
