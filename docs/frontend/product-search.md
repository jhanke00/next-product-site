# 📄 Product Search Page

## ✅ Overview

This feature adds a `/product-search` page to the Next.js application. It allows users to:

- Search products by name (with a minimum of 5 characters)
- Filter products by category via dropdown
- View filtered results in a scrollable grid format

## 🔍 Feature Highlights

- Built with **React**, **Next.js (App Router)**, and **TypeScript**
- Uses `Product` type for consistent data handling across components
- Product data is loaded from mock JSON (`/src/mock/small/products.json`)
- Componentized with:
  - `SearchBar` (text input)
  - `CategorySelect` (dropdown)
  - `ProductGrid` (scrollable results)

## 🗂️ Folder Structure

```
/app/product-search/page.tsx
/src/components/product-search/SearchBar.tsx
/src/components/product-search/CategorySelect.tsx
/src/components/product-search/ProductGrid.tsx
/src/utils/product-search/filterProducts.ts
/src/type/products/index.ts
```

## 🧪 How to Test

1. Run the app:

```bash
pnpm dev
```

2. Visit: [http://localhost:3000/product-search](http://localhost:3000/product-search)
3. Interact with:
   - Text input (e.g., `Chair`, `Tuna`, `Keyboard`)
   - Category dropdown (e.g., `Toys`, `Clothing`, `Electronics`)

## 🔧 How It Works

- `SearchBar` updates `searchTerm` via props
- `CategorySelect` updates `selectedCategory`
- `filterProducts.ts` applies filtering logic
- `ProductGrid` displays filtered products
- Uses `useEffect` to reactively update filtered list on input changes

## 🧠 Future Enhancements

- Debounced search to reduce re-renders
- Add sorting (price, rating)
- Support fuzzy search (e.g., Fuse.js)
- Pagination / infinite scroll for large datasets

## 👨‍💻 Author Notes

- Typescript mismatch errors were resolved by matching the `Product` type to the exact mock JSON structure
- Double assertion (`as unknown as Product[]`) was used for safe JSON casting
- Product mock data includes fields: `id`, `name`, `price`, `description`, `category`, `rating`, `numReviews`, and `countInStock`

---

✅ Ready for PR submission under issue [#142](https://github.com/jhanke00/next-product-site/issues/142)
