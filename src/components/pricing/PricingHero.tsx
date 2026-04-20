import styles from './PricingHero.module.css'

export default function PricingHero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>
        Simple pricing for serious<br />
        <span className="text-gradient">engineering.</span>
      </h1>
      <p className={styles.subtitle}>
        Choose the vault that scales with your ambition. Start for free,<br />
        upgrade for enterprise-grade security.
      </p>
    </section>
  )
}
