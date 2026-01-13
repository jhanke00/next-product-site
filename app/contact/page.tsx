'use client';

import styles from './page.module.css';

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Contact Us</h1>
      <p className={styles.ptext}>
        We’d love to hear from you! Whether you have a question about a product, need help with an order, or just want
        to give feedback, we are here to help.
      </p>
      <p className={styles.ptext}>Email: support@example.com</p>
      <p className={styles.ptext}>Phone: +1 (123) 111-11111</p>
      <p className={styles.ptext}>Address: 123 Shopping Street, E-commerce City</p>
    </div>
  );
}
