# Users Page

- Displaying All Users from Mock Data:
  The feature enables the display of all users available in the mock data. Admins can now browse through the entire user data, providing them with a view of all registered users.

- Pagination for Improved Navigation:
  To enhance user experience and prevent issues associated with infinite scrolling, pagination functionality was introduced. Users can now navigate through the user list more efficiently by moving between different pages, allowing for smoother and more organized browsing.

# User Details Page with Orders History

- Page with Orders History and Calculated Total for a User:
  The feature offers detailed user profiles on a single page. Admins can now access information about each user, including profile details, contact information, orders history with ordered products, and calculated total amount for all orders. This enhancement aims to provide information about all orders of selected user. To enhance user experience Back-to-Top functionality was introduced.

## Folder Structure

- `app/users/layout.tsx` - Users page layout
- `app/users/page.tsx` - Users Main Page
- `app/users/[userId]/page.tsx` - Page for the single user profile with all orders details and calculated total
- `src/mock/small/users-new.json` - Mock JSON for smal user list
- `src/mock/large/users-new.json` - Mock JSON for large user list

## Usage

- Visit the page `/users` to view all users. The page displays names and contact information. Clicking on a User card navigates to `/users/[userId]` page.
- Visit the page `/users/[userId]` to view the info about a specific user. The page displays user's info, total amount spent by the user and orders history with details including the products ordered.
