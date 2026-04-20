import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footerWrapper}>
      <div className="container">
        <div className={styles.footer}>
          <div>© 2026 VaultPrompt</div>
          <div className={styles.links}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/security">Security</Link>
            <Link href="/eula">EULA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
