import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SecurityPage() {
  return (
    <main className="container">
      <Navbar />
      <div style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Security</h1>
        <p>VaultPrompt is designed with a local-first architecture. Your prompts never leave your browser except when sent to LLM providers via our stateless proxy.</p>
      </div>
      <Footer />
    </main>
  );
}
