import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function EulaPage() {
  return (
    <main className="container">
      <Navbar />
      <div style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>EULA</h1>
        <p>By using VaultPrompt, you agree to the terms of service. VaultPrompt is provided as-is, and we are not responsible for any data loss occurring in your local browser storage.</p>
      </div>
      <Footer />
    </main>
  );
}
