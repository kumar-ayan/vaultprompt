import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './FeaturesPage.module.css';

export default function FeaturesPage() {
  return (
    <main className="container">
      <Navbar />
      <div className={styles.hero}>
        <h1>Enterprise Features</h1>
        <p>Professional grade tools for prompt engineers.</p>
      </div>
      <Footer />
    </main>
  );
}
