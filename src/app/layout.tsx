import { Analytics } from "@vercel/analytics/next";
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

const Particles = dynamic(() => import('@/components/Particles'));

export const metadata: Metadata = {
  title: 'EventPilot | AI Copilot for Physical Events',
  description: 'Your AI-powered copilot for physical events. Navigate sessions, build your schedule, and network smarter in real time.',
  keywords: ['event ai copilot', 'event planning', 'conference assistant', 'networking ai', 'EventPilot'],
  authors: [{ name: 'EventPilot Team' }],
  openGraph: {
    title: 'EventPilot | AI Copilot for Physical Events',
    description: 'Navigate sessions, build your schedule, and network smarter in real time.',
    url: 'https://eventpilot.app',
    siteName: 'EventPilot',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'EventPilot | AI Copilot for Physical Events',
    description: 'Navigate sessions, build your schedule, and network smarter in real time.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'EventPilot',
    description: 'AI-powered copilot for physical events. Navigate sessions, connect with people, and maximize your experience.',
    url: 'https://eventpilot.app',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, overflow: 'hidden' }}>
          <Particles
            particleColors={['#ffffff', '#a855f7']}
            particleCount={150}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={80}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
