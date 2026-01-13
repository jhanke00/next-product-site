"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { clearCart } from "../../store/cartSlice";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Navbar from "../components/Navbar";

export default function CheckoutPage() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    payement: ""
  });

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const mockStripePayment = () => {
    setLoading(true);

    setTimeout(() => {
      alert("Payment successful  (Mock Stripe)");
      dispatch(clearCart());
      router.push("/catalog");
      setLoading(false);
    }, 1500);
  };
  const placeOrder = () => {

    if (
      !form.name ||
      !form.email ||
      !form.address ||
      !form.city ||
      !form.postalCode
    ) {
      alert("Please fill all fields");
      return;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(form.email)) {
      alert("Please enter a valid email address");
    } 

    if (paymentMethod === "stripe") {
      mockStripePayment();
      return;
    }

    if (!paymentMethod) {
      alert("Please select the payement option")
      return;
    }
    alert("Order placed successfully!");
    dispatch(clearCart());
    router.push("/catalog");
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Checkout</h1>

      <div className={styles.checkoutGrid}>
        {/* User Details */}
        <div className={styles.formSection}>
          <h2>Shipping Details</h2>

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />

          <input
            name="postalCode"
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={handleChange}
          />

          <div className={styles.payment}>
            <h2>Payment Method</h2>

            <label className={styles.paymentOption}>
              <input
                type="radio"
                name="payment"
                value="creditCard"
                checked={paymentMethod === "creditCard"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit Card
            </label>

            <label className={styles.paymentOption}>
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              PayPal
            </label>

            <label className={styles.paymentOption}>
              <input
                type="radio"
                name="payment"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Pay with Stripe
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className={styles.summarySection}>
          <h2>Order Summary</h2>

          {cartItems.map((item) => (
            <div key={item.id} className={styles.summaryItem}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}

          <div className={styles.total}>
            <strong>Total:</strong>
            <strong>${total}</strong>
          </div>

          <button className={styles.placeOrderBtn} onClick={placeOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
