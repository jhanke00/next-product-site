# Frontend

Documentation on any Frontend capabilities or changes made.

# Prodcuts Listing Page

- Displaying All Products from Mock Data:
  We have implemented a feature that enables the display of all products available in our mock data. Users can now easily browse through the entire product catalog, providing them with a comprehensive view of our offerings.

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

### Issues

Issues related 73, 91, 82, 57 -> https://github.com/jhanke00/next-product-site/pull/148

- configured PSQL DB using prisma ORM.
- added Dockefile and docker-compose for local development(db) and Jest tests on local development and CI(test-db)
- modified CI to also runs all backend tests
- added sample unit test
- seed mock products to db before app starts
- sample getProducts endpoint (API route) with pagination
- updated package.json to easily work locally, running ci script, seed etc.
- updated products page. Data now are served from db (and keeping existing mock logic for storybook users)
- fixed storybook issue related to imports

### Frontend

- served production data from db
- make posibble to work using storybook (mock product data)
