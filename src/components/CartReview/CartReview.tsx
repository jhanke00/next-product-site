// components/checkout/CartReview.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../app/store";
import {
  goToStep,
  incrementItem,
  decrementItem,
  removeProductInCart,
} from "../../../app/slices/ItemsIncartSlices";
import styles from "./CartReview.module.scss";
import ProductItems from "../ProductItems/ProductItems";
import Link from "next/link";

const CartReview: React.FC = () => {
    const productInCart = useSelector((state: RootState) => state.cartItem.items);

  const dispatch: AppDispatch = useDispatch();

  const handleProceedToShipping = () => {
    dispatch(goToStep("shipping"));
  };

  return (
    <div>
      <div className="row">
        <div className="col">
          <h4 className="mb-5">
            <Link href="/CartPage" className="text-decoration-none text-primary py-4">
              &#8592; Back
            </Link>
          </h4>
        </div>
      </div>
      <div className="row">
        <div className="col-9">
          <h2>Cart Review</h2>
          <ProductItems />
        </div>
        <div className="col-3">
        <div className="text-center mt-5">
            <Link href="/Shipping">
              <div className={styles.cartIcon}>
              <button className="btn btn-primary mt-5"  onClick={handleProceedToShipping}>Proceed to Shipping</button>
              </div>
            </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CartReview;
