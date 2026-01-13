import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        <div className={styles.column}>
          <h3>MyStore</h3>
          <p>Your one-stop shop for quality products.</p>
        </div>

        <div className={styles.column}>
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Products</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Contact</h4>
          <p>Email: support@mystore.com</p>
          <p>Phone: xxxxxxxxxxxx</p>
        </div>

      </div>

      <div className={styles.bottom}>
        © {new Date().getFullYear()} MyStore. All rights reserved.
      </div>
    </footer>
  );
}
