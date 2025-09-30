# Shopping Cart & Checkout Documentation

## Overview

This document describes the implementation of the shopping cart and checkout flow for the product site.

## Component and pages

- [Cart State Management](#cart-context)
- [Checkout Flow Implementation](#checkout-flow)
  - [Cart Page](#cart-review)
  - [Shipping Form](#shipping-information)
  - [Payment Integration](#payment)
  - [Order Success](#order-confirmation)

## Cart State Management

- Rect Context API and useReducer hook is used for shopping cart state management
- `src/context/CartContext.tsx`.

- **Persistence:**  
  Cart contents are saved to `localStorage` to persist across sessions. On page load, the cart is initialized from storage.

- **Checkout Process:**
  1. **Cart Review:** View and update cart items.
  2. **Shipping:** Enter shipping information with validation.
  3. **Payment:** Enter payment details (mock Stripe integration).
  4. **Confirmation:** Order summary and confirmation message.

### Cart Page (`/checkout/cart`)

Found in `app/checkout/cart/page.tsx`. This is where users review their cart before checkout.

What's interesting here:

- Added quantity controls with min/max limits
- Tax calculation is currently hardcoded to 10%
- Empty state redirects to products

### Shipping Form (`/checkout/shipping`)

Found in `app/checkout/shipping/page.tsx`

- Keep the form data in localStorage
- form validation is handled for required fields and correct formats

### Payment Integration (`/checkout/payment`)

Found in `app/checkout/payment/page.tsx`

- Used Stripe Elements for PCI compliance
- Payment intent creation happens server-side (Next.js route handler)
- Error handling
- Test card number: 4242 4242 4242 4242

### Order Success (`/checkout/confirmation`)

The confirmation page (`app/checkout/confirmation/page.tsx`)

- Shows order summary
- Sends confirmation email
- Clears the cart
- Stores order in localStorage for reference

## File Locations

- Cart logic: `context/CartContext.tsx`
- Cart UI: `components/Cart.tsx`
- Checkout flow: `pages/checkout.tsx`
- Styles: `styles/globals.css`

## Labels

- `frontend`
