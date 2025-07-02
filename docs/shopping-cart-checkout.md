# Shopping Cart & Checkout Documentation

## Overview

This document describes the implementation of the shopping cart and checkout flow for the product site.

## Features

- **State Management:**  
  The cart state is managed globally using React Context (or Redux). This allows any component to access and update the cart.

- **Persistence:**  
  Cart contents are saved to `localStorage` to persist across sessions. On page load, the cart is initialized from storage.

- **UI Components:**

  - Cart display with item list, quantity adjustment, and removal.
  - Checkout steps: cart review, shipping, payment, and confirmation.

- **Checkout Process:**

  1. **Cart Review:** View and update cart items.
  2. **Shipping:** Enter shipping information with validation.
  3. **Payment:** Enter payment details (mock Stripe integration).
  4. **Confirmation:** Order summary and confirmation message.

- **Form Validation:**  
  Shipping and billing forms include validation for required fields and correct formats.

- **Payment Integration:**  
  The payment step uses a mock Stripe API for demonstration purposes.

- **Order Confirmation:**  
  After successful payment, an order is created and a confirmation email is sent (mocked).

- **Responsive Design:**  
  All cart and checkout components are responsive and mobile-friendly.

## File Locations

- Cart logic: `context/CartContext.tsx`
- Cart UI: `components/Cart.tsx`
- Checkout flow: `pages/checkout.tsx`
- Styles: `styles/globals.css`

## Labels

- `frontend`

## Notes

- Stripe and email integrations are mocked for demo.
- All logic is client-side for this implementation.
