import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <main className="container">
      <Navbar />
      <div style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Privacy</h1>
        <p>Your privacy is our priority. VaultPrompt stores all prompt data locally in your browser. We do not store your prompts on our servers.</p>
      </div>
      <Footer />
    </main>
  );
}
