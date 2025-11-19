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

# Cart and Checkout Documentation

## Cart Functionality

- **Add to Cart:**  
  Users can add products to their cart directly from the products page by clicking the "Add to Cart" button. Each product added will appear in the cart with its name, price, and quantity.

- **View Cart:**  
  The cart can be accessed from any page using the cart button in the top-right corner. The cart displays all added items, allows quantity adjustments, and shows the subtotal.

- **Remove from Cart:**  
  Users can remove items from the cart using the "Remove" button next to each product.

- **Persistence:**  
  Cart contents are saved in `localStorage`, so the cart remains intact even after a page reload.

- **Snackbar Notification:**  
  When an item is added to the cart, a snackbar message appears at the top center of the page confirming the action.

## Checkout Functionality

- **Checkout Flow:**  
  Users can proceed to checkout from the cart page. The checkout process consists of multiple steps:
  1. **Shipping Information:** Users enter their shipping address.
  2. **Payment Information:** Users provide payment details (card or UPI).
  3. **Order Review:** Users review their order, shipping, and payment details before submitting.

- **Order Confirmation:**  
  After submitting the order, users see a confirmation page with a thank you message, order summary, and a "Back to Shopping" button.

- **State Management:**  
  Checkout state (shipping, payment, cart) is stored in `localStorage` under the key `checkout_state` and is cleared after a successful order.

- **Validation:**  
  The checkout process validates that all required information is provided before allowing users to proceed to the next step.

---

For more details or troubleshooting, see the `/docs` directory or contact the development team.
