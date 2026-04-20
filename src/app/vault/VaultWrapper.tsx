'use client';

/**
 * VaultWrapper — a thin Client Component shell.
 *
 * This file exists solely to allow `next/dynamic` with `{ ssr: false }`,
 * which is forbidden in Server Components (page.tsx) but permitted here.
 * It prevents server-side rendering of VaultClient entirely, which eliminates
 * the hydration mismatch caused by VaultClient reading `localStorage` on mount.
 */
import dynamic from 'next/dynamic';

const VaultClient = dynamic(() => import('./VaultClient'), {
  ssr: false,
  loading: () => (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 80px)',
      color: 'rgba(255,255,255,0.3)',
      fontSize: '0.9rem',
      gap: '10px',
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        style={{ animation: 'spin 1.2s linear infinite' }}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      Loading EventPilot…
    </div>
  ),
});

export default function VaultWrapper() {
  return <VaultClient />;
}
