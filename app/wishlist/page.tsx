"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { removeFromWishlist } from "../../store/wishlistSlice";
import Navbar from "../components/Navbar";
import Link from "next/link";
import styles from "./page.module.css";

export default function WishlistPage() {
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className={styles.container}>
      {/* <Navbar /> */}

      <h1 className={styles.heading}>Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className={styles.empty}>Your wishlist is empty 🤍</p>
      ) : (
        <div className={styles.list}>
          {wishlist.map(item => (
            <div key={item.id} className={styles.card}>
              <div className={styles.info}>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.price}>${item.price}</p>
              </div>

              <div className={styles.actions}>
                <Link href={`/catalog/${item.id}`}>
                  <button className={styles.viewBtn}>View</button>
                </Link>

                <button
                  className={styles.removeBtn}
                  onClick={() => dispatch(removeFromWishlist(item.id))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
