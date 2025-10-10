import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  removeProductInCart,
  incrementItem,
  decrementItem,
} from "../../../app/slices/ItemsIncartSlices";
import { useAppSelector } from "../../../app/hooks";
import styles from "./CartComponent.module.scss";
import Link from "next/link";
import ProductItems from "../ProductItems/ProductItems";
import { resetCartItems } from '../../../app/slices/ItemsIncartSlices';

const CartComponent: React.FC = () => {
  const [totalPrice, setTotalPrice] = useState(0);
//   const [data, setData] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const productInCart = useAppSelector((state) => state.cartItem.items);
  const dispatch = useDispatch();

  const resetCart = () => {
    dispatch(resetCartItems());
  }

  useEffect(() => {
    const totalprice = productInCart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotalPrice(totalprice);

    const items = productInCart.reduce((total, item) => total + item.quantity, 0);
    setTotalItem(items)
  }, [productInCart]);

  const removeItem = (product: any) => {
    dispatch(removeProductInCart(product.id));
  };

  return (
    <div className={styles.productList}>
      <div className="row">
        <div className="col">
          <h4 className="mb-5">
            <Link href="/" className="text-decoration-none text-primary py-4">
              &#8592; Back
            </Link>
          </h4>
        </div>
      </div>
      
      <div className="row">
        <div className="col col-md-9">
          <div className={`${styles.myProduct}`}>
            {totalItem == 0 ? (
              <>
                <h2>Your cart is empty</h2>
              </>
            ) : (
                <ProductItems />
            )}
          </div>
        </div>
        <div className="col col-md-3">
          <div className={styles.summary}>
            <h3>Subtotal: {totalPrice}</h3>
            <h4>Total items: {totalItem}</h4>
            <div className="text-center mt-5">
            <Link href="/CartReview">
              <div className={styles.cartIcon}>
                <button className={`btn btn-primary ${styles.proceedBtn}`}>Proceed to buy</button>
              </div>
            </Link>
            </div>
          </div>
          <div className="text-center">
            <button className={`btn btn-primary mt-5 ${styles.proceedBtn}`} onClick={resetCart}>Clear Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartComponent;
