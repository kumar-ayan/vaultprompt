'use client'
import { useState } from 'react'
import styles from './PricingFAQ.module.css'

const faqs = [
  {
    id: 'faq-privacy',
    question: 'Is my data private?',
    answer:
      'Yes. We use end-to-end encryption for all stored prompts. On the Essentials plan, your processing happens entirely locally, ensuring your intellectual property never touches our servers unless you sync it.',
  },
  {
    id: 'faq-versioning',
    question: 'How does the versioning work?',
    answer:
      'Every time you save a session plan, EventPilot creates a snapshot. You can revisit past plans, sessions you attended, or networking connections without losing context or historical data.',
  },
  {
    id: 'faq-upgrade',
    question: 'Can I upgrade or downgrade anytime?',
    answer:
      'Absolutely. Changes to your plan are pro-rated and reflected on your next billing cycle. No hidden cancellation fees or long-term lock-ins.',
  },
]

interface FAQ {
  id: string
  question: string
  answer: string
}

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
      <button
        id={faq.id}
        className={styles.question}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${faq.id}-answer`}
      >
        <span>{faq.question}</span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      <div
        id={`${faq.id}-answer`}
        className={styles.answer}
        role="region"
        aria-labelledby={faq.id}
      >
        <p>{faq.answer}</p>
      </div>
    </div>
  )
}

export default function PricingFAQ() {
  return (
    <section className={styles.section} aria-label="Frequently asked questions">
      <h2 className={styles.heading}>Frequently Asked Questions</h2>
      <div className={styles.list}>
        {faqs.map((faq) => (
          <FAQItem key={faq.id} faq={faq} />
        ))}
      </div>
    </section>
  )
}
