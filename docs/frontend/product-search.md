# Product Search Page

## Overview

The **Product Search Page** provides a simple interface at `/product-search` to search and filter products. It fetches recommended products from the server initially, and then uses **React Query** to cache data and efficiently filter products based on user input. Metadata has also been included for SEO and page context.

---

## Metadata

- **Title:** `Recommended products / [NO_OF_PRODUCTS] based on search`
- **Description:** `Browse products [MATCHING_QUERY]`

---

## Features / Usage

1. Navigate to `/product-search`.
2. Recommended products are displayed by default. Products are considered recommended if:
   - Rating is **greater than 4.7**, and
   - Product is **in stock**.
   - Products are sorted in **descending order of rating**.
3. Type in the search box to filter products.
4. Filtered results appear below the input in real-time.

---

## File Structure

| Type          | Path                                                                                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page**      | `/app/product-search/page.tsx`                                                                                                                      |
| **Component** | `/src/components/organisms/ProductSearch.tsx`                                                                                                       |
| **Molecules** | `/src/components/molecules/NoProducts.tsx` <br> `/src/components/molecules/ProductCard.tsx` <br> `/src/components/molecules/ProductSearchInput.tsx` |

---

## Testing

1. Run the development server.
2. Navigate to `/product-search`.
3. Enter different search terms in the input box to validate that results filter correctly.
