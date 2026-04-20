import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './FeaturesPage.module.css'

export default async function FeaturesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <div className="container">
        <Navbar user={user} />
      </div>

      <main className={styles.container}>
        <div className={styles.breadcrumb}>
          VAULT &rsaquo; ANALYSES &rsaquo; <span>EXECUTIVE STRATEGY V3</span>
        </div>

        <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: '0' }}>
          VaultPrompt Features & AI Evaluator
        </h1>

        <div className={styles.dashboardLayout}>
          {/* LEFT COLUMN */}
          <div className={styles.leftColumn}>
            <div className={styles.scoreCard}>
              <div className={styles.progressCircle}>
                <svg className={styles.svgCircle} viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" className={styles.circleBackground} />
                  <circle cx="80" cy="80" r="70" className={styles.circleProgress} />
                </svg>
                <div className={styles.scoreText}>
                  <span className={styles.scoreNumber}>82</span>
                  <span className={styles.scoreLabel}>VAULT SCORE</span>
                </div>
              </div>
              <h3 className={styles.statusTitle}>Optimization Required</h3>
              <p className={styles.statusDescription}>
                {"Your prompt shows strong 'Chain of Thought' reasoning but lacks specific 'Zero-shot' context for the target persona."}
              </p>
            </div>


          </div>

          {/* RIGHT COLUMN */}
          <div className={styles.rightColumn}>
            <div>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>AI Improvement Suggestions</h2>
                <span className={styles.badge}>3 Critical Fixes</span>
              </div>

              <div className={styles.suggestionCard}>
                <div className={styles.suggestionIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18h6M10 22h4M12 2a5 5 0 0 0-5 5c0 1.5.8 2.8 2 3.5V14a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3.5c1.2-.7 2-2 2-3.5a5 5 0 0 0-5-5z"/>
                  </svg>
                 </div>
                 <div className={styles.suggestionContent}>
                   <div className={styles.suggestionHeader}>
                     <h4>Add target audience context</h4>
                   </div>
                   <p>{"The current prompt is generic. Specifying 'Financial Analyst with 5+ years experience' will refine the output quality."}</p>
                 </div>
               </div>

              <div className={`${styles.suggestionCard} ${styles.highlighted}`}>
                <div className={styles.suggestionIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                 </div>
                 <div className={styles.suggestionContent}>
                   <div className={styles.suggestionHeader}>
                     <h4>Specify tone of voice</h4>
                   </div>
                   <p>{"Explicitly define the tone as 'Technical yet accessible' to prevent the AI from defaulting to overly academic language."}</p>
                 </div>
               </div>

              <div className={styles.suggestionCard}>
                <div className={styles.suggestionIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className={styles.suggestionContent}>
                  <div className={styles.suggestionHeader}>
                    <h4>Incorporate Few-shot examples</h4>
                  </div>
                  <p>Providing 2-3 examples of desired output format will significantly increase consistency across long-form generations.</p>
                </div>
              </div>
            </div>

            <div>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Prompt Versioning Timeline</h2>
              </div>
              <div className={styles.timelineCard}>
                <div className={styles.timeline}>
                  
                  <div className={styles.timelineItem}>
                    <div className={`${styles.timelineNode} ${styles.active}`}>V3</div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineContentMain}>
                        <h4>Enhanced Reasoning</h4>
                        <p>{"Added 'Chain of Thought' step-by-step verification markers."}</p>
                      </div>
                      <span className={styles.timelineMeta}>CURRENT</span>
                    </div>
                  </div>

                  <div className={styles.timelineItem}>
                    <div className={styles.timelineNode}>V2</div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineContentMain}>
                        <h4>Variable Injection</h4>
                        <p>Implemented dynamic placeholders for client data payloads.</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.timelineItem}>
                    <div className={styles.timelineNode}>V1</div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineContentMain}>
                        <h4>Initial Draft</h4>
                        <p>Basic zero-shot instruction set for generic summaries.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* BOTTOM SECTION - Extends to edges */}
      <section className={styles.bottomSection}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <path d="M7 15v-6M12 15v-4M17 15v-8"/>
              </svg>
            </div>
            <h3>Deep Token Metrics</h3>
            <p>Monitor token consumption and efficiency across various LLM architectures in real-time.</p>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
            <h3>Semantic Search</h3>
            <p>Retrieve relevant prompts using vector-based similarity, not just keyword matching.</p>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <line x1="10" y1="9" x2="8" y2="9"/>
              </svg>
            </div>
            <h3>A/B Refinement</h3>
            <p>Run head-to-head comparisons between different prompt strategies to find the winner.</p>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', textAlign: 'center', background: 'rgba(168, 85, 247, 0.05)', borderTop: '1px solid rgba(168, 85, 247, 0.1)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Stop guessing. Start engineering.</h2>
          <p style={{ opacity: 0.8, marginBottom: '40px', fontSize: '1.2rem' }}>
            Join hundreds of developers who use VaultPrompt to refine their AI interactions.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link href="/demo" style={{ padding: '14px 28px', background: '#a855f7', color: 'white', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 14px 0 rgba(168, 85, 247, 0.39)' }}>
              See Live Demo
            </Link>
            <Link href="/login" style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
