# Frontend

Documentation on changes added for user specific orders page.

# Users Listing Page(`/users`)

Navigate to `/users`  see the list of users available.

- Displaying All Users from Mock Data:
  Implemented a feature that enables the display of all users available in the mock data. Users can now easily selct any user from the list.

- Pagination for Improved Navigation:
  To enhance user experience, introduced pagination functionality similar to products page. Users can now navigate through the users list more efficiently by moving between different pages, allowing for smoother and more organized browsing.

# User Specific Order Details Single Page(`/users/[userId]`)

- Single Page for complete list of Order Details by a specific user:
  Introduced a feature that offers all the order details associated with a user. On selection of any user from the previous page list, the user is taken to a new page where all the orders asscciated with the user will be listed. Specifications including order id, order name, Quantity ordered and Price is displayed. An extra column with the total price for each order is also shown for smooth experience of total calculation. If there are no orders done by selected user, an appropriate message is shown to indicate no orders.

  The total expense by the user on all orders is also displayed on the top.
  To take in consideration of large amount of data(if there are), a loader message is added till the page gets populated with all the order details for a user.

  Navigate to `/users/[userId]` with specific user ids to see the order details.

## Folder Structure

- `app/users/page.tsx` - Users Main Page
- `app/users/[userId]/page.tsx` - Page for the order Details of a user including total expense
- `src/components/OrderDetails.tsx` - component which shows the specific order details including    price, Quantity, ID and name
- `src\type\orders\index.ts` - data types are addede here