import Link from 'next/link'
import styles from './PricingCards.module.css'

const plans = [
  {
    id: 'essentials',
    label: 'Essentials',
    price: '$0',
    period: '/mo',
    description: 'Perfect for individual developers starting their prompt journey.',
    features: [
      '50 prompt analyses',
      '3 versions per prompt',
      'Local-only processing',
    ],
    cta: 'Start for Free',
    ctaHref: '/login',
    featured: false,
  },
  {
    id: 'pro',
    label: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'For power users who need deep visibility into AI interactions.',
    features: [
      'Unlimited analyses',
      'Infinite versioning',
      'Semantic search',
      'Engineering-grade metrics',
    ],
    cta: 'Get Started',
    ctaHref: '/login',
    featured: true,
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Scalable infrastructure for large organisations and high confidence.',
    features: [
      'Custom SSO',
      'Role-based access',
      'Dedicated API tunnelling',
      '24/7 Priority support',
    ],
    cta: 'Contact Sales',
    ctaHref: '#',
    featured: false,
  },
]

function CheckIcon() {
  return (
    <svg
      className={styles.checkIcon}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

export default function PricingCards() {
  return (
    <section className={styles.section} id="pricing-plans" aria-label="Pricing plans">
      <div className={styles.grid}>
        {plans.map((plan) => (
          <article
            key={plan.id}
            id={`plan-${plan.id}`}
            className={`${styles.card} ${plan.featured ? styles.featured : ''}`}
          >
            {plan.featured && (
              <div className={styles.badge} aria-label="Most popular plan">
                MOST POPULAR
              </div>
            )}

            <p className={styles.planLabel}>{plan.label.toUpperCase()}</p>

            <div className={styles.priceRow}>
              <span className={styles.price}>{plan.price}</span>
              {plan.period && (
                <span className={styles.period}>{plan.period}</span>
              )}
            </div>

            <p className={styles.description}>{plan.description}</p>

            <ul className={styles.features} role="list">
              {plan.features.map((feat) => (
                <li key={feat} className={styles.featureItem}>
                  <CheckIcon />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.ctaHref}
              id={`cta-${plan.id}`}
              className={`${styles.cta} ${plan.featured ? styles.ctaFeatured : styles.ctaDefault}`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
