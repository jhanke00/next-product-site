# Frontend

Documentation on any Frontend capabilities or changes made.

# Prodcuts Listing Page http://localhost:3000/products

- Displaying All Products from Mock Data:
  We have implemented a feature that enables the display of all products available in our mock data. Users can now easily browse through the entire product catalog, providing them with a comprehensive view of our offerings.

  - Search functionality

    - If you search on the header, this will update search query praram in Url and searches product according to the search term. (This will search all values of product like title, description, category)
    - If the user update search query itself directly, it will automatically fill out the search input field and update search.
    - If the user refresh the page this will preserve the search key in both url and search box and update the product list.

  - Filter functionality
    - All filter functionalities are same as Search and this is located in left side and this will dynamically update url and form fields.

- Pagination for Improved Navigation:
  To enhance user experience and prevent issues associated with infinite scrolling, we have introduced pagination functionality. Users can now navigate through the product list more efficiently by moving between different pages, allowing for smoother and more organized browsing.

# Prodcuts Detail Single Page

- Single Page Description for Products:
  We have introduced a feature that offers detailed product descriptions on a single page. Users can now access comprehensive information about each product, including specifications, pricing, and additional details, all in one centralized location. This enhancement aims to provide users with a better understanding of our products, facilitating informed decision-making during their shopping experience.

## Folder Structure

- `app/products/layout.tsx` - Product page layout
- `app/products/page.tsx` - Product Main Page
- `app/products/[productId]/page.tsx` - Page for the single page description
- `src/mock/small/products-new.json` - Mock JSON for Prodcut list
- `src/mock/large/products-new.json` - Mock JSON for Prodcut list

### Components folder structure.

```
└── 📁 components
    └── 📁 Header
        └── Header.tsx
        └── SearchField.tsx
    └── 📁 Product
        └── Product.tsx
    └── 📁 ProductFilter
        └── ProductFilter.tsx
    └── 📁 ReusableComponents
        └── 📁 MultiRangeSlider
            └── MultiRangeSlider.module.css
            └── MultiRangeSlider.tsx
        └── 📁 SelectField
            └── SelectField.tsx
        └── 📁 TextField
            └── TextField.tsx
    └── index.md
```

The components directory contains the following components:

- **Header:** This directory includes the following files:
  - **Header.tsx:** A Header component having a search input field.
  - **SearchField.tsx:** A component responsible for the search functionality. It dynamically updates the query, ensuring preservation upon page refresh.
  - **Product:** Contained within this directory is the product component:
- **Product.tsx:** The primary component offering detailed product information within the product list.
- **ProductFilter:** This directory has product filter components:
  - **ProductFilter.tsx:** Positioned on the left side of the product list, this component facilitates filtering based on categories, price, stock, and ratings. The filter synchronizes with URL query parameters and component state variables.
- **ReusableComponents:** This directory has reusable components:
  - **MultiRangeSlider:** Multi range reusable component directory.
  - **MultiRangeSlider.module.css:** The CSS module file for the multi-range slider.
  - **MultiRangeSlider.tsx:** Implementation of the multi-range slider.
  - **SelectField:** A directory containing the following file:
  - **SelectField.tsx:** The primary component file for the select field.
  - **TextField:** A directory containing the following file:
  - **TextField.tsx:** The primary component file for the text field.

### Hooks Structure

```
└── 📁 hooks
    └── useDebounce.ts
```

- **Hooks:** This directory includes the reusable and customized react hooks.
  - **useDebounce.ts:** This hook is for search functionality that triggers search after a white after finishing the typing in the search box.

### Providers Structure

```
└── 📁 providers
    └── SearchProvider.tsx
```

- **Providers:** This directory includes the customized providers created with React.createContext.
  - **SearchProvider.tsx:** This Provider contains search functionality to update the query param and getting value from param and update the search field value.
