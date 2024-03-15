# Frontend

# User Order Details

This page displays all orders for a specific user. Each order includes information about the products that were ordered and the total amount spent by the user.

## Features

- Display all orders for a specific user.
- Show details of each order including the products and total spent.
- Calculate the total spent by the user.

## Usage

- Visit the page `/user-orders/[userId]` to view the orders for a specific user.
- The page displays each order with details including the products ordered and the total amount spent by the user.

# File changes Made

- **User Orders Page**: `/app/user-orders/[userId]/page.tsx`
- **Components**:
  - `/src/components/user-orders/card/card.tsx`
  - `/src/components/user-orders/order-summary/order-summary.tsx`
- **Utils**: `/src/utils/user-orders/order-calculation.tsx`
