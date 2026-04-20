import Link from 'next/link';
import BlurText from './BlurText';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.badge}>
        THE PROMPT ENGINEERING DEVTOOL
      </div>

      <h1 className={styles.title}>
        <BlurText text="Stop guessing your" delay={0.06} className={styles.titleLine} />
        <br />
        <BlurText text="prompts." delay={0.06} initialDelay={0.18} className={styles.titleLine} />{' '}
        <BlurText text="Start" delay={0.06} initialDelay={0.24} gradient={true} className={styles.titleLine} />
        <br />
        <BlurText text="engineering them." delay={0.06} initialDelay={0.30} gradient={true} className={styles.titleLine} />
      </h1>

      <p className={styles.subtitle}>
        Analyze, score, and version your prompts like code — before you waste tokens.<br />
        Built for developers, creators, and AI teams who want predictable outputs.
      </p>

      <div className={styles.actions}>
        <Link href="/demo" className={styles.btnPrimary}>See Live Demo</Link>
        <Link href="/how-it-works" className={styles.btnSecondary}>See How It Works</Link>
      </div>
    </section>
  );
}
