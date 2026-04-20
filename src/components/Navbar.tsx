'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import styles from './Navbar.module.css';

interface NavbarProps {
  user?: User | null
}

export default function Navbar({ user }: NavbarProps) {
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
    <nav className={classNames(styles.navbar, scrolled && styles.scrolled)}>
      <div className={styles.logo}>
        <Link href="/">VaultPrompt</Link>
      </div>
      
      <div className={styles.links}>
        <Link href="/" className={classNames(pathname === '/' && styles.activeLink)}>Why VaultPrompt</Link>
        <Link href="/features" className={classNames(pathname === '/features' && styles.activeLink)}>Features</Link>
      </div>
      
      <div className={styles.actions}>
        {user ? (
          <Link href="/auth/signout">Logout</Link>
        ) : (
          <Link href="/login">Login</Link>
        )}
        <Link href="/demo" className={styles.tryDemoBtn}>See Live Demo</Link>
      </div>
    </nav>
  );
}
