# User API Endpoints

This document describes the User API endpoints for the large dataset.

## Endpoints

1. Get User Information

   - URL: `/api/users/[userId]`
   - Method: GET
   - Response: User object

2. Get User Orders

   - URL: `/api/users/[userId]/orders`
   - Method: GET
   - Query Parameters:
     - page (optional): Page number for pagination
     - limit (optional): Number of items per page
   - Response: Paginated list of orders

3. Get User Total Spent
   - URL: `/api/users/[userId]/total-spent`
   - Method: GET
   - Response: Total amount spent by the user

## Large Dataset Considerations

- Pagination is implemented for the orders endpoint to handle large amounts of data efficiently.
- Caching is used to improve response times for frequently accessed data.
- Queries are optimized for large datasets using in-memory indexing.

## Setup

To run the project:

1. Ensure Node.js and pnpm are installed on your machine.
2. Run `pnpm install` to install dependencies.
3. Run `pnpm dev` to start the development server.
4. The API will be available at `http://localhost:3000/api/users/`.
