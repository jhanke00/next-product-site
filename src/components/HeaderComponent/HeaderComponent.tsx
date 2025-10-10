import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HeaderCompoent.module.scss";
import logo from "../../../public/images/logo.png";
import cart from "../../../public/images/cart.png";
import { useAppSelector } from "../../../app/hooks";

const HeaderComponent: React.FC = () => {
  const [totalItem, setTotalItem] = useState(0);
  const productInCart = useAppSelector((state) => state.cartItem.items);
  useEffect(() => {
    const items = productInCart.reduce((total, item) => total + item.quantity, 0);
    setTotalItem(items)
  }, [productInCart]);
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <Link href="/">
          <div className={styles.logo}>
            <h1>
              <Image src={logo} height={80} width={100} alt="page logo" />
            </h1>
          </div>
        </Link>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/">
              <div className={styles.cartIcon}>
                Products
              </div>
            </Link>
          </li>
          <li>
            <Link href="/CartPage">
              <div className={styles.cartIcon}>
                <Image src={cart} height={40} width={40} alt="cart image" /> 
                { totalItem > 0 && 
                    <span className={styles.totalCount}>{totalItem}</span>
                }
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderComponent;
