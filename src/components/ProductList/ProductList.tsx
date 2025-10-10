import React, { useState, useEffect } from "react";
// import productData from "../../../public/product/product-list.json";
import productData from '../../mock/small/products.json';
import { useDispatch } from "react-redux";
import { addProduct } from "../../../app/slices/productsSlice";
import { addProductInCart } from "../../../app/slices/ItemsIncartSlices";
import { useAppSelector } from "../../../app/hooks";
import styles from './ProductList.module.scss';

const ProductList: React.FC = () => {
  const data = productData;
  const [disabledItems, setDisabledItems] = useState<string[]>([]);
  const products = useAppSelector((state) => state.products.items);
  const dispatch = useDispatch();
  useEffect(() => {
    data.map((product) => {
      dispatch(addProduct(product));
    });
  }, []);

  const addItem = (product: any) => {
    dispatch(addProductInCart(product));
    setDisabledItems((prevDisabledItems) => [...prevDisabledItems, product.id]);
  }
  
  return (
    <div className={styles.productList}>
      <div className="row">
        <div className="col-12">
          <div className={`row ${styles.myProduct}`}>
            {products.length > 0 &&
              products.map((product) => (
                <div key={product.id} className="col col-md-6 col-lg-4">
                    <div className={styles.productItem}>
                        {/* <Image src={product.imageUrl} width={100} height={80} alt={product.category} /> */}
                        <div>
                            <h3 className={styles.productTitle}>{product?.name}</h3>
                            <span className={styles.productPrice}>Price: {product?.price}</span>
                            <p className={styles.productRating}>Rating: {product?.rating}</p>
                        </div>
                        <button className={`btn btn-secondary `} disabled={disabledItems.includes(product.id)}  onClick={() => addItem(product)}>Add to cart</button>
                    </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
