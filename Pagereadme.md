**Products Page Documentation**

- **File**: [app/products/page.tsx](app/products/page.tsx)

**Purpose**: Client-side product listing with combined search and pagination.

**Overview**:

- Loads mock product data from `src/mock/large/products.json` and `src/mock/small/products.json` and merges them.
- Provides a combined search input that filters products by name or category and client-side pagination.

**Key behavior**:

- `searchQuery` (single input) is the primary filter. The implementation matches as follows:
  - Normalizes `searchQuery` with `trim()` and `toLowerCase()`.
  - If `searchQuery` is non-empty, the page filters products where the product **category** includes the query (case-insensitive), OR the product **name** includes the query only when the query length is at least 5 characters.
  - This means short queries (under 5 characters) only match categories; name matching requires 5+ characters.
- Filtering is computed with `useMemo` for performance and recomputes when the data or `searchQuery` change.
- Changing the search resets pagination to page 1 (`setCurrentPage(1)`).

**Pagination**:

- `PAGE_SIZE` is 20.
- `productData` is the slice of `filteredData` for the current page: `filteredData.slice(startIndex, endIndex)`.
- `totalPages` is computed as `Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE))`.
- When filters reduce available pages below the current `currentPage`, the component resets to page 1.

**UX details**:

- Scrolling: the component calls `window.scrollTo(0, 0)` whenever `currentPage` changes.
- Inputs: a single `searchQuery` input with a Clear button.

**Use memo 18-32**:

It's a useMemo that computes filteredData and only recomputes when data or searchQuery change.
sq is searchQuery.trim().toLowerCase() — normalized query for case-insensitive matching.
If sq is non-empty, it filters data by returning items where either:
the product category (lowercased) includes sq, OR
the product name (lowercased) includes sq — but only when sq.length >= 5 (short queries do not match names).
The code uses (p.name || '') and (p.category || '') to avoid undefined values.
If sq is empty, it returns the full data array (no filtering).
Purpose: provide a combined search that always matches categories but only attempts name matches for sufficiently long queries, while caching results for performance.

**41-42**:
productData = filteredData.slice(startIndex, endIndex)
Takes the subarray of filteredData for the current page: items from startIndex (inclusive) up to but not including endIndex. This implements client-side pagination by selecting only the page's items to render.
totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE))
Computes how many pages are needed: divide the total filtered item count by PAGE_SIZE and round up with Math.ceil.
Math.max(1, ...) ensures the UI reports at least one page (so when there are zero results the page count shown is 1 instead of 0), avoiding edge cases with zero pages.

**Testing locally**:

1. Start dev server:

```bash
pnpm dev
```

2. Visit `http://localhost:3000/products`.
3. Use the search box to filter products:
   - Type a short category name (e.g., "home") to match categories.
   - Type a product name of 5+ characters to match product names.
4. Navigate pages using Previous/Next.

**Improvement ideas**:

- Debounce the search input to reduce recomputation on fast typing.
- Allow explicit toggles for "search name" and "search category".
- Display a "No results" message when the filtered set is empty.
- Add server-side search/pagination for large datasets.

For code reference see [app/products/page.tsx](app/products/page.tsx).
