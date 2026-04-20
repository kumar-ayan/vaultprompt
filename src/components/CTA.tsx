import styles from './CTA.module.css';

export default function CTA() {
  return (
    <section className={styles.ctaSection}>
      <h2 className={styles.title}>
        Ready to build better<br />
        AI experiences?
      </h2>
      <div className={styles.actions}>
        <button className={styles.btnPrimary}>Start Now</button>
        <button className={styles.btnSecondary}>Talk to Sales</button>
      </div>
    </section>
  );
}
