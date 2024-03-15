# Frontend

Documentation on any Frontend capabilities or changes made.

# Overview
New feature has been added in the products page enhacements with the following options.
* User can able to view the list of products
* User can see the induvidual products details
* Pagination has been added to avoid infinite scrolling in list of products

# Products List Page

Products list will be able to showcase all the products available in mock data and it is linked with landing page for users to navigate easily. Displaying 10 products per page in pagination setup.

# Product Details Page

Each product details further displayed in separate page by selecting any product from products list page. This has all the details related to that product.


# File Changes
- File Name: app/page.tsx
Added link to products list page
- File Name: app/products-list/page.tsx
To display list of products with pagination
- File Name: app/products-list/[productId]/page.tsx
To display product details with respective product id
- File Name: src/components/ProductCard.tsx
Product Card component to display the product details. This can be reused anywhere to display prodcut information


