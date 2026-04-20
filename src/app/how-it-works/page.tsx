import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './HowItWorks.module.css'

export default async function HowItWorksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <div className="container">
        <Navbar user={user} />
      </div>

      <main className={styles.container}>
        <div className={styles.breadcrumb}>
          VAULT &rsaquo; <span>SYSTEM ARCHITECTURE</span>
        </div>

        <div className={styles.header}>
          <h1>How VaultPrompt Works</h1>
          <p>
            Dive into the technical mechanics of our Prompt Engineering DevTool. See exactly how we transform a messy, zero-shot draft into an enterprise-grade LLM instruction set in four isolated phases.
          </p>
        </div>

        <div className={styles.timeline}>
          {/* Phase 1 */}
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>
                Phase 1: The Input Stage <span className={styles.stepBadge}>CLIENT</span>
              </h2>
              <p className={styles.stepDescription}>
                It starts with your raw idea. You input a basic, unoptimized prompt into our web editor. Most initial prompts are written conversationally, lack rigid constraints, and have no strict input/output demarcations.
              </p>
              <div className={styles.insightBox}>
                <div className={styles.insightTitle}>The Vulnerability</div>
                <div className={styles.insightText}>
                  {'Basic prompts like '}
                  <code>{'"Summarize this financial article"'}</code>
                  {" leave output parameters entirely up to the model's latent space, guaranteeing inconsistent behavior across different platforms like Claude or GPT-4."}
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
            </div>
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>
                Phase 2: Deep-Audit Engine <span className={styles.stepBadge}>ANALYSIS</span>
              </h2>
              <p className={styles.stepDescription}>
                {'Clicking "Analyze" triggers an API tunnel to our auditing model. The agent breaks down the prompt and scores it against 3 core engineering pillars: Clarity, Constraints, and Output Format. We dock points for vague verbs, weak boundaries, and undefined schemas.'}
              </p>
              <div className={styles.insightBox}>
                <div className={styles.insightTitle}>Under The Hood</div>
                <div className={styles.insightText}>
                  The auditing agent is instructed specifically to be aggressively nitpicky. A score of 80+ requires perfection—meaning the target persona, format constraints, and domain exactness are crystal clear.
                </div>
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>
                Phase 3: Automated Refactoring <span className={styles.stepBadge}>AI-DRIVEN</span>
              </h2>
              <p className={styles.stepDescription}>
                {"When you request an Improvement, our secondary reasoning engine engages. It preserves your exact goal and tone, but automatically injects missing constraints (like JSON output definitions) and solidifies the role persona."}
              </p>
              <div className={styles.insightBox}>
                <div className={styles.insightTitle}>Zero-Shot to Few-Shot</div>
                <div className={styles.insightText}>
                  The refactoring engine automatically adds boundary markers (like <code>&lt;context&gt;</code> tags) and injects systemic guardrails that prevent the model from hallucinating outside its specific boundaries.
                </div>
              </div>
            </div>
          </div>

          {/* Phase 4 */}
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
            </div>
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>
                Phase 4: The Enterprise Vault <span className={styles.stepBadge}>DATABASE</span>
              </h2>
              <p className={styles.stepDescription}>
                {'Click "Save", and the optimized prompt alongside its Readiness Score is committed to your secure database. Every iteration is permanently locked in version control, creating a searchable repository of production-ready prompts.'}
              </p>
              <div className={styles.insightBox}>
                <div className={styles.insightTitle}>Supabase Architecture</div>
                <div className={styles.insightText}>
                  We utilize PostgreSQL for rock-solid data integrity. The <code>prompts</code> table tracks the entity, while <code>prompt_versions</code> holds the actual iterations, semantic commits, and metric payloads.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '80px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '60px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Ready to optimize your workflow?</h2>
          <p style={{ opacity: 0.7, marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
            Stop wasting tokens on unoptimized prompts. Start using the devtool built for prompt engineering.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link href="/demo" style={{ padding: '12px 24px', background: 'white', color: 'black', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
              Try Live Demo
            </Link>
            <Link href="/pricing" style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
              View Pricing
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
