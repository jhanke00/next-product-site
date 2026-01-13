"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { use } from "react";
import { RootState, AppDispatch } from "../../../store/store";
import { addToCart } from "../../../store/cartSlice";
import { addToWishlist } from "../../../store/wishlistSlice";
import { useRouter } from "next/navigation";




export default function ProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params);
  const products = useSelector((state: RootState) => state.products.items);
  const product = products.find((p) => p.id === productId);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const wishlistItems = useSelector(
  (state: RootState) => state.wishlist.items
);
const isInWishlist = wishlistItems.some(i => i.id === productId);

  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(1);

  if (!product) return <p>Product not found</p>;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity,
      })
    );
    setAdded(true);
    alert(`${product.name} added to cart!`);
  };


  return (
    <div className={styles.container}>
      <b className={styles.detailscontainer}>Product Details</b>
      <h1>Name: {product.name}</h1>
      <p>Price: ${product.price}</p>
      <p>description: {product.description}</p>
      <p>Total Reviews: {product.numReviews}</p>
      <div>
        <label>
          Quantity:{" "}
          <input
            type="number"
            value={quantity}
            min={1}
            max={product.countInStock}
            onChange={(e) => {
              const val = Number(e.target.value);
              setQuantity(val > product.countInStock ? product.countInStock : val);
            }}
          />
        </label>
      </div>
      <button className={styles.button} onClick={handleAddToCart}>{added ? "Added to Cart" : "ADD TO CART"}</button>
      <button className={styles.button} onClick={() =>dispatch(
            addToWishlist({
              id: product.id,
              name: product.name,
              price:  Number(product.price),
            })
          )
        }
        disabled={isInWishlist}
      >
        {isInWishlist ? "In Wishlist ❤️" : "Add to Wishlist 🤍"}
      </button>
      <button className={styles.continueBtn} onClick={() => router.push("/catalog")}>
  Continue Shopping
</button>
    </div>
  );
}
