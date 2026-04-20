'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const classNames = (...classes: (string | boolean | undefined)[]) => {
    return classes.filter(Boolean).join(' ').trim();
  };

  return (
    <nav className={classNames(styles.navbar, scrolled && styles.scrolled)} suppressHydrationWarning>
      {/* suppressHydrationWarning is added to overcome Turbopack cache or browser extension DOM manipulations */}
      <div className={styles.logo}>
        <Link href="/">VaultPrompt</Link>
      </div>
      
      <div className={styles.links}>
        <Link href="/" className={classNames(pathname === '/' && styles.activeLink)}>Why VaultPrompt</Link>
        <Link href="/features" className={classNames(pathname === '/features' && styles.activeLink)}>Features</Link>
        <Link href="/demo" className={classNames(pathname === '/demo' && styles.activeLink)}>Live Demo</Link>
      </div>
    </nav>
  );
}
