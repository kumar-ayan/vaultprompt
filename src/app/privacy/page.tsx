import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/components/Legal.module.css';
import { createClient } from '@/utils/supabase/server';

export default async function PrivacyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <div className="container">
        <Navbar user={user} />
      </div>
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: April 11, 2026</p>
        </div>
        <div className={styles.content}>
          <p>At VaultPrompt, privacy is treated as a fundamental feature, not an afterthought. This Privacy Policy details how we collect, process, and protect your information.</p>
          
          <h2>1. Information We Collect</h2>
          <p>We automatically collect base analytical data regarding platform usage. Account registration requires an email address. We also collect the prompts, iterations, and generated metrics you explicitly save to your Enterprise Vault.</p>
          
          <h2>2. How We Use Information</h2>
          <ul>
            <li>To provide, maintain, and improve our services.</li>
            <li>To process your prompt analysis via encrypted endpoints.</li>
            <li>To securely backup your prompt version history.</li>
          </ul>

          <h2>3. Data Protection and Models</h2>
          <p><strong>Your prompts are never used to train our models.</strong> Any prompt processed through our API gateway is ephemeral unless explicitly saved. We maintain isolated environments for enterprise clients to ensure cross-tenant contamination is technically impossible.</p>

          <h2>4. Third-Party Sharing</h2>
          <p>We do not sell your personal data. Prompt analysis may utilize third-party vendor APIs (like OpenRouter); we enforce strict zero-retention data processing agreements with these sub-processors.</p>

          <h2>5. Your Rights</h2>
          <p>You may request a total erasure of your account and saved vaults at any time. Contact our privacy team to exercise your right to be forgotten.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
