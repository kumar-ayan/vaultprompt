import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import styles from './FeaturesPage.module.css';

export const metadata = {
  title: 'Features | EventPilot – AI Copilot for Physical Events',
  description: 'Explore EventPilot features: Smart Schedule Builder, Real-time Event Suggestions, Networking Assistant, Google Search Grounding, and Safety Auditing.',
};

export default function FeaturesPage() {
  return (
    <main className="container">
      <Navbar />

      {/* ── Hero ── */}
      <div className={styles.hero} style={{ paddingTop: '6rem', paddingBottom: '3rem', textAlign: 'center' }}>
        <div className={styles.breadcrumb} style={{ justifyContent: 'center' }}>
          <span>EVENTPILOT</span> › <span>Features</span>
        </div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>
          Everything you need to<br />
          <span style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            own every event you attend
          </span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
          Stop wandering conference halls. EventPilot turns your intent into a structured, real-time action plan — powered by Google Gemini and live internet context.
        </p>
        <Link href="/vault" className="btn-primary" style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          background: 'linear-gradient(135deg, #a855f7, #6366f1)',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 600,
          textDecoration: 'none',
          fontSize: '1rem',
        }}>
          Try Event Copilot →
        </Link>
      </div>

      {/* ── Dashboard Layout (Score + Privacy) ── */}
      <div className={styles.dashboardLayout} style={{ marginTop: '4rem' }}>

        {/* LEFT COLUMN: Completeness Score + Trust Card */}
        <div className={styles.leftColumn}>

          <div className={styles.scoreCard}>
            <div className={styles.progressCircle}>
              <svg className={styles.svgCircle} viewBox="0 0 160 160">
                <circle className={styles.circleBackground} cx="80" cy="80" r="70" />
                <circle className={styles.circleProgress} cx="80" cy="80" r="70" />
              </svg>
              <div className={styles.scoreText}>
                <span className={styles.scoreNumber}>5</span>
                <span className={styles.scoreLabel}>/ 5 rating</span>
              </div>
            </div>
            <div className={styles.statusTitle}>Itinerary Quality Score</div>
            <p className={styles.statusDescription}>
              EventPilot&apos;s internal LLM judge rates every generated plan on completeness — timeline, sessions, icebreakers — so you always know the quality before you act.
            </p>
          </div>

          <div className={styles.privacyCard}>
            <div className={styles.privacyHeader}>
              <span>TRUST &amp; SAFETY</span>
              <span style={{ color: '#4ade80', fontSize: '0.7rem' }}>✔ Verified</span>
            </div>

            <div className={styles.privacyItem}>
              <div className={styles.iconWrapper}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div className={styles.privacyItemText}>
                <h4>Local-First Storage</h4>
                <p>All saved plans stay in your browser. Your event goals never touch our servers.</p>
              </div>
            </div>

            <div className={styles.privacyItem}>
              <div className={styles.iconWrapper}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <div className={styles.privacyItemText}>
                <h4>Google Perspective Auditing</h4>
                <p>Every event query is audited for bias and toxicity before hitting the AI engine.</p>
              </div>
            </div>

            <div className={styles.privacyItem}>
              <div className={styles.iconWrapper}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div className={styles.privacyItemText}>
                <h4>Stateless AI Proxy</h4>
                <p>Zero database. Each AI call is brokered in-memory with no query logging.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Core Features as suggestion cards */}
        <div className={styles.rightColumn}>

          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Core Features</h2>
            <span className={styles.badge}>Powered by Gemini 1.5 Pro</span>
          </div>

          {/* Feature 1 */}
          <div className={`${styles.suggestionCard} ${styles.highlighted}`}>
            <div className={styles.suggestionIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div className={styles.suggestionContent}>
              <div className={styles.suggestionHeader}>
                <h4>Smart Schedule Builder</h4>
                <span className={styles.pointBadge}>AI-Powered</span>
              </div>
              <p>
                Describe your goals, availability, and interests — EventPilot generates a time-boxed itinerary tailored to your conference day. No more decision paralysis in the hallway.
              </p>
              <div className={styles.applyLink}>
                <Link href="/vault">Try it → Plan My Event</Link>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className={styles.suggestionCard}>
            <div className={styles.suggestionIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div className={styles.suggestionContent}>
              <div className={styles.suggestionHeader}>
                <h4>Real-time Event Suggestions</h4>
                <span className={styles.pointBadge}>Google Search</span>
              </div>
              <p>
                Enable &quot;Ground with Google Search&quot; and the AI pulls live context about ongoing or upcoming sessions relevant to your query — keeping recommendations fresh, not hallucinated.
              </p>
              <div className={styles.applyLink}>
                <Link href="/vault">Enable in the Event Copilot →</Link>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className={styles.suggestionCard}>
            <div className={styles.suggestionIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className={styles.suggestionContent}>
              <div className={styles.suggestionHeader}>
                <h4>Networking Assistant</h4>
                <span className={styles.pointBadge}>Icebreakers</span>
              </div>
              <p>
                Every generated plan includes 2 context-aware icebreakers crafted for relevant attendees or speakers in your domain — so you always have a natural conversation opener ready.
              </p>
              <div className={styles.applyLink}>
                <Link href="/vault">Get Your Icebreakers →</Link>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className={styles.suggestionCard}>
            <div className={styles.suggestionIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className={styles.suggestionContent}>
              <div className={styles.suggestionHeader}>
                <h4>Safety Audit (Perspective API)</h4>
                <span className={styles.pointBadge}>Google Jigsaw</span>
              </div>
              <p>
                Powered by Google&apos;s Perspective API — every event query is scored for toxicity (0–100%) before submission. Enterprise-grade trust signals built directly into your workflow.
              </p>
              <div className={styles.applyLink}>
                <Link href="/vault">Run a Safety Audit →</Link>
              </div>
            </div>
          </div>

          {/* Feature 5 */}
          <div className={styles.suggestionCard}>
            <div className={styles.suggestionIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div className={styles.suggestionContent}>
              <div className={styles.suggestionHeader}>
                <h4>AI Query Refiner</h4>
                <span className={styles.pointBadge}>One Click</span>
              </div>
              <p>
                Vague about your goals? Hit &quot;Refine Query&quot; and Gemini will rewrite your intent into a highly specific, actionable request — specifying domain, time constraints, and networking targets automatically.
              </p>
              <div className={styles.applyLink}>
                <Link href="/vault">Refine My Query →</Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── How It Works Timeline ── */}
      <div style={{ maxWidth: '800px', margin: '5rem auto' }}>
        <div className={styles.timelineCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <span className={styles.badge}>4 steps</span>
          </div>
          <div className={styles.timeline}>

            <div className={styles.timelineItem}>
              <div className={`${styles.timelineNode} ${styles.active}`}>1</div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineContentMain}>
                  <h4>Describe Your Event Goal</h4>
                  <p>Type a natural query: &quot;I like AI and startups — suggest sessions&quot; or &quot;I have 1 hour free, what&apos;s worth attending?&quot;</p>
                </div>
                <span className={styles.timelineMeta}>Input</span>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={`${styles.timelineNode} ${styles.active}`}>2</div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineContentMain}>
                  <h4>Google Search Grounding (Optional)</h4>
                  <p>Enable the toggle and the system fetches live event context from Google, injecting top 3 snippets directly into the AI&apos;s context window.</p>
                </div>
                <span className={styles.timelineMeta}>Grounding</span>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={`${styles.timelineNode} ${styles.active}`}>3</div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineContentMain}>
                  <h4>Gemini Generates Your Itinerary</h4>
                  <p>Gemini 1.5 Pro processes your query as an Event Copilot — producing a time-based plan, session recommendations, and 2 networking icebreakers.</p>
                </div>
                <span className={styles.timelineMeta}>AI Generation</span>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelineNode}>4</div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineContentMain}>
                  <h4>Plan Rated &amp; Saved Locally</h4>
                  <p>A secondary LLM judge scores the completeness of your itinerary (1–5). You see the Itinerary Completeness Rating and can save the plan for future reference.</p>
                </div>
                <span className={styles.timelineMeta}>Output</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom Feature Grid ── */}
      <div className={styles.bottomSection}>
        <div className={styles.featuresGrid}>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l9 4.5v11L12 22l-9-4.5v-11L12 2z"/></svg>
            </div>
            <h3>Local-First Vault</h3>
            <p>All your session plans and saved itineraries are stored entirely in your browser. No account needed, zero data sent to our servers.</p>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 0 20"/><path d="M12 2a15 15 0 0 0 0 20"/></svg>
            </div>
            <h3>Real-Time Grounding</h3>
            <p>Google Programmable Search integration lets Gemini reference live event information instead of relying on stale training data.</p>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <h3>Multi-Metric Scoring</h3>
            <p>Each generated event plan is evaluated by a secondary LLM judge for completeness, practicality, and networking quality — scored 1 to 5.</p>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h3>Natural Language Input</h3>
            <p>No forms or complicated interfaces. Just type what you want — &quot;Help me network with AI founders&quot; — and get a structured, actionable plan.</p>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3>Enterprise Safety Layer</h3>
            <p>Google Perspective API audits every event query for toxicity before the AI processes it — so your event co-pilot stays professional and safe.</p>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <h3>Instant Query Refinement</h3>
            <p>One click transforms a vague idea into a highly specific, domain-targeted event query — optimized for better AI results every time.</p>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
