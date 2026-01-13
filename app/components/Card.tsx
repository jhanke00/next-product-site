import styles from  "./Card.module.css";
type Props = {
  onScrollClick: () => void;
};
export default function Card({ onScrollClick }: Props) {
  return (
     <section className={styles.hero}>
     <div> <h1 className={styles.subtitle}>🎉 Happy New Year 2026! 🎉</h1>
      <div className={styles.confetti}></div>
      <div className={styles.confetti}></div>
      <div className={styles.confetti}></div>
      <div className={styles.confetti}></div>
      <div className={styles.confetti}></div>
      <div className={styles.confetti}></div></div>
      <p className={styles.subtitle}>ONLINE STORE</p>
      <h1 className={styles.title}>Discover Products You’ll Love</h1>
      <p className={styles.description}>
        Quality items, great prices, delivered to your door.
      </p>
      <button className={styles.button} onClick={onScrollClick}>Shop Now</button>
    </section>
  );
}
