import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

enum Step {
  CartReview,
  Shipping,
  Payment,
  Confirmation,
}

const CartReviewStep = ({ cart, next }: { cart: any; next: () => void }) => (
  <div>
    <h2>Cart Review</h2>
    {cart.items.length === 0 ? (
      <div>Your cart is empty.</div>
    ) : (
      <ul>
        {cart.items.map((item: any) => (
          <li key={item.id}>
            {item.name} x {item.quantity} - ${item.price * item.quantity}
          </li>
        ))}
      </ul>
    )}
    <div style={{ marginTop: 16 }}>
      <button disabled={cart.items.length === 0} onClick={next}>
        Next: Shipping
      </button>
      <Link href='/cart' style={{ marginLeft: 8 }}>
        Back to Cart
      </Link>
    </div>
  </div>
);

const ShippingStep = ({ shipping, setShipping, shippingError, setShippingError, prev, next, setEmail }: any) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      if (!shipping.name.trim() || !shipping.address.trim() || !shipping.email.trim()) {
        setShippingError('Please fill in all shipping fields.');
        return;
      }
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(shipping.email)) {
        setShippingError('Please enter a valid email address.');
        return;
      }
      setShippingError(null);
      setEmail(shipping.email);
      next();
    }}
  >
    <h2>Shipping Information</h2>
    <div>
      <label>Name:</label>
      <input
        required
        value={shipping.name}
        onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
        style={{ width: '100%', marginBottom: 8 }}
      />
    </div>
    <div>
      <label>Address:</label>
      <input
        required
        value={shipping.address}
        onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
        style={{ width: '100%', marginBottom: 8 }}
      />
    </div>
    <div>
      <label>Email:</label>
      <input
        required
        type='email'
        value={shipping.email}
        onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
        style={{ width: '100%', marginBottom: 8 }}
        placeholder='you@example.com'
      />
    </div>
    {shippingError && <div style={{ color: 'red', marginBottom: 8 }}>{shippingError}</div>}
    <button type='button' onClick={prev}>
      Back
    </button>
    <button type='submit' style={{ marginLeft: 8 }}>
      Next: Payment
    </button>
  </form>
);

const PaymentStep = ({
  payment,
  setPayment,
  errors,
  setErrors,
  isProcessing,
  setIsProcessing,
  showStripeModal,
  setShowStripeModal,
  handleOrder,
  prev,
}: any) => (
  <div>
    <h2>Payment</h2>
    {!showStripeModal && (
      <button
        style={{
          background: '#635bff',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          padding: '12px 24px',
          fontWeight: 600,
          fontSize: 16,
          cursor: 'pointer',
          marginBottom: 16,
        }}
        onClick={() => setShowStripeModal(true)}
        disabled={isProcessing}
      >
        Pay with Stripe
      </button>
    )}
    {showStripeModal && (
      <StripeModal
        payment={payment}
        setPayment={setPayment}
        errors={errors}
        setErrors={setErrors}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        handleOrder={handleOrder}
        setShowStripeModal={setShowStripeModal}
      />
    )}
    <button
      type='button'
      onClick={prev}
      disabled={isProcessing || showStripeModal}
      style={{ marginTop: 16, marginLeft: 8 }}
    >
      Back
    </button>
  </div>
);

const ConfirmationStep = ({ orderId, emailSent, shipping }: any) => (
  <div>
    <h2>Order Confirmation</h2>
    <p>Thank you for your order!</p>
    <p>
      Your order ID: <strong>{orderId}</strong>
    </p>
    {!emailSent ? (
      <p>Sending confirmation email...</p>
    ) : (
      <p style={{ color: 'green' }}>
        Confirmation email sent to <strong>{shipping.email}</strong>.
      </p>
    )}
    <Link href='/'>Return to Home</Link>
  </div>
);

const StripeModal = ({
  payment,
  setPayment,
  errors,
  setErrors,
  isProcessing,
  setIsProcessing,
  handleOrder,
  setShowStripeModal,
}: any) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.4)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        background: '#fff',
        borderRadius: 8,
        padding: 32,
        minWidth: 320,
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        position: 'relative',
      }}
    >
      <button
        onClick={() => setShowStripeModal(false)}
        style={{
          position: 'absolute',
          top: 8,
          right: 12,
          background: 'none',
          border: 'none',
          fontSize: 20,
          cursor: 'pointer',
        }}
        disabled={isProcessing}
        aria-label='Close'
      >
        ×
      </button>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          let valid = true;
          const { card, expiry, cvc } = payment;
          const newErrors = { card: '', expiry: '', cvc: '' };

          if (!card.trim() || !/^\d{16}$/.test(card.replace(/\s/g, ''))) {
            newErrors.card = 'Enter a valid 16-digit card number.';
            valid = false;
          }
          if (!expiry.trim() || !/^\d{2}\/\d{2}$/.test(expiry)) {
            newErrors.expiry = 'Enter expiry as MM/YY.';
            valid = false;
          }
          if (!cvc.trim() || !/^\d{3,4}$/.test(cvc)) {
            newErrors.cvc = 'Enter a valid 3 or 4 digit CVC.';
            valid = false;
          }

          setErrors(newErrors);
          if (!valid) return;

          setIsProcessing(true);
          await new Promise((res) => setTimeout(res, 1500));
          setIsProcessing(false);
          setShowStripeModal(false);
          await handleOrder();
        }}
      >
        {/* Card details form */}
        {/* ... */}
      </form>
    </div>
  </div>
);

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>(Step.CartReview);
  const [shipping, setShipping] = useState({ name: '', address: '', email: '' });
  const [payment, setPayment] = useState({ card: '', expiry: '', cvc: '' });
  const [orderId, setOrderId] = useState<string | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [errors, setErrors] = useState({ card: '', expiry: '', cvc: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState<string>('');
  const { state: cart, dispatch } = useCart();

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const sendConfirmationEmail = async (orderId: string, email: string) => {
    try {
      await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, email }),
      });
      setEmailSent(true);
    } catch {
      setEmailSent(false);
    }
  };

  const handleOrder = async () => {
    const newOrderId = 'ORDER' + Math.floor(Math.random() * 100000);
    setOrderId(newOrderId);
    dispatch({ type: 'CLEAR_CART' });
    next();
    await sendConfirmationEmail(newOrderId, shipping.email);
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1>Checkout</h1>
      <div style={{ marginBottom: 24 }}>Step {step + 1} of 4</div>
      {step === Step.CartReview && <CartReviewStep cart={cart} next={next} />}
      {step === Step.Shipping && (
        <ShippingStep
          shipping={shipping}
          setShipping={setShipping}
          shippingError={shippingError}
          setShippingError={setShippingError}
          prev={prev}
          next={next}
          setEmail={setEmail}
        />
      )}
      {step === Step.Payment && (
        <PaymentStep
          payment={payment}
          setPayment={setPayment}
          errors={errors}
          setErrors={setErrors}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          showStripeModal={showStripeModal}
          setShowStripeModal={setShowStripeModal}
          handleOrder={handleOrder}
          prev={prev}
        />
      )}
      {step === Step.Confirmation && <ConfirmationStep orderId={orderId} emailSent={emailSent} shipping={shipping} />}
    </div>
  );
}
