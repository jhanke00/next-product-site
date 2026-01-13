"use client";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";


export default function Navbar() {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // total quantity in cart
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const wishlistCount = useSelector(
    (state: RootState) => state.wishlist.items.length
  );


  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">ShopCart</Link>
      </div>

      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>

      <div className={styles.actions}>
        <Link href="/wishlist">
           🤍
          {wishlistCount > 0 && <span> ({wishlistCount})</span>}
        </Link>
        <Link href="/cart"><span>🛒       {cartCount > 0 && (
          <span
            style={{
              marginLeft: "6px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 8px",
              fontSize: "12px",
            }}
          >
            {cartCount}
          </span>
        )}</span></Link>
      </div>
    </header>
  );
}
