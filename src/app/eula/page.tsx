import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/components/Legal.module.css';
import { createClient } from '@/utils/supabase/server';

export default async function EulaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <div className="container">
        <Navbar user={user} />
      </div>
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>End User License Agreement</h1>
          <p className={styles.lastUpdated}>Last Updated: April 11, 2026</p>
        </div>
        <div className={styles.content}>
          <p>{'Please read this End User License Agreement ("EULA") carefully before utilizing the VaultPrompt application. By using the software, you agree to be bound by the terms of this Agreement.'}</p>
          
          <h2>1. License Grant</h2>
          <p>VaultPrompt grants you a personal, non-transferable, non-exclusive license to use the VaultPrompt software globally in accordance with the terms of this EULA. Organizations utilizing enterprise plans are granted seat-based licenses as defined during purchasing.</p>
          
          <h2>2. Intellectual Property</h2>
          <p>The VaultPrompt software, including its original code, audit engines, and algorithms, is the exclusive property of VaultPrompt Inc. However, <strong>you retain full ownership of all prompts</strong>, iterations, and intellectual property you input or generate utilizing our tools.</p>

          <h2>3. Restrictions on Use</h2>
          <p>You agree not to, and you will not permit others to:</p>
          <ul>
            <li>License, sell, rent, or lease the software.</li>
            <li>Modify, derive, or reverse engineer any part of the VaultPrompt auditing engine.</li>
            <li>Use the platform to evaluate or optimize prompts designed to generate illegal, non-consensual, or malicious content.</li>
          </ul>

          <h2>4. Termination</h2>
          <p>This EULA is effective from the date you first use the Software and shall continue until terminated. Your rights under this EULA will terminate automatically without notice if you fail to comply with any of its terms.</p>

          <h2>5. Limitation of Liability</h2>
          <p>In no event will VaultPrompt be liable for any incidental, special, indirect, or consequential damages whatsoever arising out of or related to your use of the software.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
