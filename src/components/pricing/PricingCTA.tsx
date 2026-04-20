import Link from 'next/link'
import styles from './PricingCTA.module.css'

export default function PricingCTA() {
  return (
    <section className={styles.section} aria-label="Call to action">
      <div className={styles.card}>
        <h2 className={styles.title}>Ready to upgrade your workflow?</h2>
        <p className={styles.subtitle}>
          Join thousands of engineers who trust VaultPrompt to secure their<br />
          intellectual capital.
        </p>
        <div className={styles.actions}>
          <Link href="/demo" id="cta-try-demo" className={styles.btnPrimary}>
            See Live Demo
          </Link>
          <Link href="#" id="cta-talk-engineering" className={styles.btnSecondary}>
            Talk to Engineering
          </Link>
        </div>
      </div>
    </section>
  )
}
