import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  removeProductInCart,
  incrementItem,
  decrementItem,
} from "../../../app/slices/ItemsIncartSlices";
import { useAppSelector } from "../../../app/hooks";
import styles from "./ProductItems.module.scss";

const ProductItems: React.FC = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [data, setData] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const productInCart = useAppSelector((state) => state.cartItem.items);
  const dispatch = useDispatch();

  useEffect(() => {
    const totalprice = productInCart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotalPrice(totalprice);

    const items = productInCart.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setTotalItem(items);
  }, [productInCart]);

  const removeItem = (product: any) => {
    dispatch(removeProductInCart(product.id));
  };

  return (
    <div className={styles.productList}>
      <div className={`row ${styles.myProduct}`}>
        {productInCart.map((product: any) => (
          <div key={product.id} className="col-12 col-md-6 col-lg-4">
            <div className={styles.productItem}>
              <div>
                <h3 className={styles.productTitle}>{product?.name}</h3>
                <span className={styles.productPrice}>
                  Price: {product?.price}
                </span>
                <p className={styles.countSection}>
                  <span onClick={() => dispatch(incrementItem(product))}>
                    +
                  </span>{" "}
                  {product.quantity}{" "}
                  <span onClick={() => dispatch(decrementItem(product))}>
                    -
                  </span>
                </p>
              </div>
              <button
                className={`btn btn-secondary`}
                onClick={() => removeItem(product)}
              >
                Remove Item
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductItems;
