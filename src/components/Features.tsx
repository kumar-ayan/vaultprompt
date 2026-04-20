import BlurText from './BlurText';
import styles from './Features.module.css';

export default function Features() {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.heading}>
        <h2 className={styles.title}>
          <BlurText text="Event planning is no longer overwhelming." delay={0.03} />
        </h2>
        <p className={styles.subtitle}>
           <BlurText text="We built the real-time personalized guidance you've been missing." delay={0.03} />
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <h3 className={styles.cardTitle}>
            <BlurText text="Smart Schedule Builder" delay={0.03} />
          </h3>
          <p className={styles.cardDescription}>
            <BlurText text="Don't blindly guess what to attend. Our AI constructs a personalized, time-based itinerary based on your exact interests and availability." delay={0.015} />
          </p>
          <div className={styles.chartMock}>
            {Array.from({length: 10}).map((_, i) => (
              <div key={i} className={styles.chartBar}></div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
          </div>
          <h3 className={styles.cardTitle}>
            <BlurText text="Real-time Event Suggestions" delay={0.03} />
          </h3>
          <p className={styles.cardDescription}>
            <BlurText text="Get dynamic recommendations for keynotes or workshops happening near you, instantly updated when you encounter unexpected free time." delay={0.015} />
          </p>
          <div className={styles.lockMock}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
          </div>
        </div>
      </div>

      <div className={styles.gridSmall}>
        <div className={styles.cardSmall}>
          <div className={styles.cardIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <h3 className={styles.cardTitle}>
            <BlurText text="Networking Assistant" delay={0.03} />
          </h3>
          <p className={styles.cardDescription}>
            <BlurText text="Don't know how to start a conversation? Let the AI generate context-aware icebreakers to connect with relevant attendees or speakers seamlessly." delay={0.015} />
          </p>
        </div>

        <div className={styles.cardSmall}>
          <div className={styles.cardIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" x2="12" y1="8" y2="8"/><line x1="3.95" x2="8.54" y1="6.06" y2="14"/><line x1="10.88" x2="15.46" y1="21.94" y2="14"/></svg>
          </div>
          <h3 className={styles.cardTitle}>
            <BlurText text="Context-Aware Advice" delay={0.03} />
          </h3>
          <p className={styles.cardDescription}>
            <BlurText text="Our engine prevents scheduling conflicts and highlights overlapping sessions, ensuring you never miss the key opportunities that matter most to you." delay={0.015} />
          </p>
          <div className={styles.linesMock}>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
