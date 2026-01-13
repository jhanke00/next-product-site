'use client';

import styles from './page.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>About Us</h1>
      <p className={styles.ptext}>
        Welcome to our store! We are committed to providing the best products and services to our customers. Our mission
        is to make online shopping simple, enjoyable, and reliable.
      </p>
      <p className={styles.ptext}>
        Our team works hard to select quality products, ensure fast shipping, and provide excellent customer support.
        Thank you for visiting our store!
      </p>
    </div>
  );
}
