# Cart & Checkout

> This document explains the **technical design, architecture, and implementation logic** behind the Shopping Cart & Checkout feature introduced in **PR #201** for `next-product-site`.

---

## 1. High-Level Architecture

The cart and checkout system is implemented using:

- **Next.js App Router** (for pages & layouts)
- **React Context API** (global cart state)
- **Client Components** for interactive UI
- **Serverless API Route** for order processing
- **Optional Email Integration** for order confirmation

Flow:

`Product Page → AddToCartButton → CartContext → /cart → /checkout (multi-step) → /api/orders`

---

## 2. Cart State Management – `CartContext.tsx`

### Purpose

Centralized state management for cart items, quantities, and totals across the application.

### Core Logic

```ts
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
```

State is maintained using:

```ts
const [items, setItems] = useState<CartItem[]>([]);
```

### Key Functions

#### `addItem(product)`

- Checks if item already exists in cart
- If yes → increments quantity
- If no → pushes new item with quantity = 1

```ts
setItems((prev) => {
  const existing = prev.find((i) => i.id === product.id);
  if (existing) {
    return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
  }
  return [...prev, { ...product, quantity: 1 }];
});
```

#### `removeItem(id)`

- Filters out item by id

```ts
setItems((prev) => prev.filter((i) => i.id !== id));
```

#### `updateQuantity(id, qty)`

- Maps through items and updates quantity

#### `clearCart()`

- Resets cart state to empty array

---

## 3. Add To Cart – `AddToCartButton.tsx`

### Purpose

Reusable button component to add products from product pages.

### Logic

- Uses `useCart()` hook from `CartContext`
- On click → calls `addItem(product)`

```ts
const { addItem } = useCart()

<button onClick={() => addItem(product)}>Add to Cart</button>
```

This ensures **zero coupling** between product pages and cart implementation.

---

## 4. Cart UI – `CartView.tsx`

### Purpose

Display cart items, quantities, subtotal, and actions.

### Key Logic

#### Subtotal Calculation

```ts
const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
```

#### Quantity Update

- Uses `updateQuantity` from context
- Controlled inputs tied to state

#### Remove Item

- Calls `removeItem(id)` from context

---

## 5. Cart Page – `app/cart/page.tsx`

### Purpose

Route: `/cart`

Renders:

```tsx
<CartView />
<Link href="/checkout">Proceed to Checkout</Link>
```

### Logic

- Pulls cart state from context
- Conditionally shows empty state vs cart items

```ts
if (items.length === 0) return <EmptyCart />
```

---

## 6. Checkout Layout – `app/checkout/layout.tsx`

### Purpose

Defines persistent layout for all checkout steps.

```tsx
export default function CheckoutLayout({ children }) {
  return (
    <div className='checkout-container'>
      <CheckoutSteps />
      {children}
    </div>
  );
}
```

### Why Layout?

- Keeps step indicator & styling consistent
- Avoids duplication across steps

---

## 7. Checkout Page – `app/checkout/page.tsx`

### Purpose

Implements **multi-step checkout flow** in a single page using local state.

### State

```ts
const [step, setStep] = useState<'review' | 'shipping' | 'payment' | 'confirmation'>('review');
const [shipping, setShipping] = useState({ name: '', address: '', city: '', postal: '', email: '' });
const [payment, setPayment] = useState({ card: '', expiry: '', cvv: '' });
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
```

---

## 8. Step 1 – Review

### Logic

- Displays cart items from context
- Displays subtotal
- Next button → `setStep('shipping')`

No API calls here – purely client-side validation.

---

## 9. Step 2 – Shipping

### Logic

Controlled inputs:

```ts
<input value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })} />
```

Validation:

- Checks all required fields before moving to payment

```ts
if (!shipping.name || !shipping.address || !shipping.email) return alert('Fill all fields');
```

On success → `setStep('payment')`

---

## 10. Step 3 – Payment

### Logic

- Mock inputs only
- No real gateway integration
- On submit → calls `placeOrder()`

---

## 11. Order Placement – `placeOrder()`

```ts
async function placeOrder() {
  setStatus('loading');
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, shipping, total: subtotal }),
  });

  if (res.ok) {
    setStatus('success');
    clearCart();
    setStep('confirmation');
  } else {
    setStatus('error');
  }
}
```

### Key Points

- Uses cart context data
- Sends complete payload to backend
- Clears cart only on success

---

## 12. API – `app/api/orders/route.ts`

### Purpose

Handles order creation and optional email sending.

### POST Handler

```ts
export async function POST(req: Request) {
  const { items, shipping, total } = await req.json();

  const order = {
    id: crypto.randomUUID(),
    items,
    shipping,
    total,
    status: 'paid',
    createdAt: new Date().toISOString(),
  };

  // optional email logic

  return NextResponse.json({ success: true, order });
}
```

---

## 13. Email Logic (Optional)

### SendGrid Path

```ts
if (process.env.SENDGRID_API_KEY) {
  await sgMail.send({ to, from, subject, html });
}
```

### SMTP Fallback

```ts
const transporter = nodemailer.createTransport({ host, port, auth });
await transporter.sendMail({ to, from, subject, html });
```

### Design Choice

- **Graceful degradation** – if no email config, order still succeeds
- Avoids blocking checkout flow

---

## 14. Confirmation Step

### Logic

```tsx
if (status === 'success') return <SuccessMessage />;
if (status === 'error') return <ErrorMessage />;
```

- Pure UI state
- No further side effects

---

## 15. Dependency Changes

### Why new deps?

- `nodemailer` – SMTP email
- `@sendgrid/mail` – SendGrid support

Added in `package.json` and locked in `pnpm-lock.yaml`.

---

## 16. Design Decisions & Rationale

### Why React Context instead of Redux?

- Simpler
- No boilerplate
- Sufficient for cart scope

### Why single-page multi-step checkout?

- Faster UX
- Easier state sharing
- Avoids query param / route sync issues

### Why mock payment?

- Keeps PR focused on architecture
- Allows easy replacement with Stripe/Razorpay later

---

## 17. Extensibility

This architecture supports:

- Stripe/Razorpay integration in `placeOrder()`
- Persistent cart (localStorage) in `CartContext`
- Auth-based checkout
- Order history page

---

## preview Email:

Where the email HTML is built: the route maps items to itemsHtml then injects it and shipping/total into the template string assigned to html (the <p> / <ul> template in the file).
How the preview URL is created: when the code sends mail via Nodemailer (the transporter.sendMail(...) path) it receives an info object; nodemailer.getTestMessageUrl(info) returns an Ethereal preview URL if the transporter was created with an Ethereal test account. That value is assigned to previewUrl.
When preview is returned to the client: the route returns JSON that includes emailPreview: previewUrl (or null if none). The client (page.tsx) reads that and shows a preview link when present.
Why SendGrid path has no preview: SendGrid sends the message via the provider API and does not produce an Ethereal-style preview URL, so the code returns emailPreview: null for the SendGrid branch.
Practical notes: to get a preview URL locally, run without real SMTP/SendGrid env vars so the code falls back to Nodemailer’s createTestAccount() (Ethereal). The preview URL will also be logged by the route. If you want previews when using a real SMTP or SendGrid, you must use their provider tooling (or persist the HTML server-side and expose it).

## 18. Summary

This PR introduces a **clean, scalable, and decoupled** cart + checkout system using:

- Context for state
- App Router for routing
- API routes for backend logic
- Optional integrations without tight coupling

The implementation is production-structured while remaining simple for iteration.

---

**Author:** PR #201
**Module:** Cart & Checkout
**Status:** Ready for review & extension
