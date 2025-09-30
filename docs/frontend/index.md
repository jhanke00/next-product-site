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

- Stripe Integration
  - Added Stripe dependencies:
    - `stripe`
    - `@stripe/stripe-js`
    - `@stripe/react-stripe-js`
  - Implemented payment processing functionality
  - Added checkout flow with multiple steps:
    - Cart review (`/checkout/cart`)
    - Shipping information (`/checkout/shipping`)
    - Payment processing (`/checkout/payment`)
    - Order confirmation (`/checkout/confirmation`)

### Configuration

- Environment Variables (required):
  ```
  NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_publishable_key
  STRIPE_SECRET_KEY=your_secret_key
  ```

### Checkout pages

```
app/
  api/
    create-payment-intent/  # Stripe payment intent creation
  checkout/                 # Checkout flow pages
    cart/
    confirmation/
    payment/
    shipping/
```

### Testing

To test the payment integration:

1. Use Stripe's test card numbers:
   - Success: 4242 4242 4242 4242
   - Decline: 4000 0000 0000 0002
2. Use any future expiry date
3. Use any 3-digit CVC

### Dependencies Added

```json
{
  "stripe": "latest",
  "@stripe/stripe-js": "latest",
  "@stripe/react-stripe-js": "latest"
}
```
