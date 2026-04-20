import Link from 'next/link';
import BlurText from './BlurText';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.badge}>
        THE PHYSICAL EVENT COMPANION
      </div>

      <h1 className={styles.title}>
        <BlurText text="Stop wandering" delay={0.06} className={styles.titleLine} />
        <br />
        <BlurText text="around." delay={0.06} initialDelay={0.18} className={styles.titleLine} />{' '}
        <BlurText text="Start" delay={0.06} initialDelay={0.24} gradient={true} className={styles.titleLine} />
        <br />
        <BlurText text="connecting." delay={0.06} initialDelay={0.30} gradient={true} className={styles.titleLine} />
      </h1>

      <p className={styles.subtitle}>
        An AI Copilot for Physical Events. Navigate the chaos, discover key sessions, and optimize your real-world interactions.<br />
        Built to solve event confusion and maximize high-value networking.
      </p>

      <div className={styles.actions}>
        <Link href="/vault" className={styles.btnPrimary}>Plan My Event</Link>
        <Link href="/how-it-works" className={styles.btnSecondary}>See How It Works</Link>
      </div>
    </section>
  );
}
