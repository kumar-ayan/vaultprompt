import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './HowItWorks.module.css';

export default function HowItWorksPage() {
  return (
    <main className="container">
      <Navbar />
      <div className={styles.hero}>
        <h1>How It Works</h1>
        <p>Learn how VaultPrompt helps you engineer better prompts.</p>
      </div>
      <Footer />
    </main>
  );
}
