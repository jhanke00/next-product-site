# Components

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

The `components` directory contains the following components:

- `Header`: This directory includes the following files:

  - `Header.tsx`: A Header component having a search input field.
  - `SearchField.tsx`: A component responsible for the search functionality. It dynamically updates the query, ensuring preservation upon page refresh.

- `Product`: Contained within this directory is the product component:

  - `Product.tsx`: The primary component offering detailed product information within the product list.

- `ProductFilter`: This directory has product filter components:

  - `ProductFilter.tsx`: Positioned on the left side of the product list, this component facilitates filtering based on categories, price, stock, and ratings. The filter synchronizes with URL query parameters and component state variables.

- `ReusableComponents`: This directory has reusable components:
  - `MultiRangeSlider`: Multi range reusable component directory.
    - `MultiRangeSlider.module.css`: The CSS module file for the multi-range slider.
    - `MultiRangeSlider.tsx`: Implementation of the multi-range slider.
  - `SelectField`: A directory containing the following file:
    - `SelectField.tsx`: The primary component file for the select field.
  - `TextField`: A directory containing the following file:
    - `TextField.tsx`: The primary component file for the text field.
