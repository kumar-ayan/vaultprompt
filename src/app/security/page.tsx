import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/components/Legal.module.css';
import { createClient } from '@/utils/supabase/server';

export default async function SecurityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <div className="container">
        <Navbar user={user} />
      </div>
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Security Architecture</h1>
          <p className={styles.lastUpdated}>Last Updated: April 11, 2026</p>
        </div>
        <div className={styles.content}>
          <p>VaultPrompt was built from the ground up to handle sensitive enterprise intellectual property. This document outlines our security measures and infrastructure.</p>
          
          <h2>1. Data Encryption</h2>
          <p>All data transmitted between your client and our servers is encrypted using industry-standard TLS 1.3. Data at rest, including all prompt sequences and historical versions stored in our PostgreSQL vaults, is encrypted via AES-256 block-level encryption.</p>
          
          <h2>2. Authentication and Access</h2>
          <p>We leverage OAuth and robust identity providers to verify user access. Session tokens are fiercely managed, and our backend enforces strict Row-Level Security (RLS) policies ensuring that users can only ever access their own data contexts.</p>

          <h2>3. Infrastructure and Operations</h2>
          <ul>
            <li>Our infrastructure is hosted on isolated virtual private clouds.</li>
            <li>We utilize continuous monitoring and threat detection telemetry.</li>
            <li>System dependencies are routinely audited for CVEs via automated integration pipelines.</li>
          </ul>

          <h2>4. Vulnerability Disclosure</h2>
          <p>If you are a security researcher and have discovered a potential vulnerability, please reach out to our engineering team directly at [EMAIL HIDDEN]. We appreciate responsible disclosure and will investigate immediately.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
