# Learning Resources UI

## Overview

The product detail page now surfaces a "Learning Resources" module that lists tutorials, guides, and videos associated with the currently viewed product. Contributors and internal enablement teams can add new entries directly from the UI without leaving the page.

## Key Capabilities

- Fetches learning resources from the `/api/products/[productId]/resources` endpoint on page load.
- Supports inline creation of new resources (title, format, URL, description, optional duration).
- Displays resources in reverse chronological order with quick links to external content.
- Provides optimistic UX with loading indicators, success messaging, and validation feedback.

## Implementation Details

- Component: `src/components/ProductResources/ProductResources.tsx`
- Imported in `app/products/[productId]/page.tsx` to bridge server-rendered product data with the client-side experience.
- Designed with Tailwind utility classes already available in the project.
- Uses the fetch API to communicate with the backend route and reacts to responses without a full page reload.

## Testing the UI

1. Run `pnpm dev` and open `http://localhost:3000/products/<productId>`.
2. Confirm that existing resources appear for products that have data in `src/mock/resources.json`.
3. Submit a new tutorial from the form and verify it renders instantly.
4. Refresh to ensure persisted data remains available (API writes back to `src/mock/resources.json`).
