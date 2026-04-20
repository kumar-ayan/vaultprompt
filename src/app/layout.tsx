import { Analytics } from "@vercel/analytics/next";
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

const Particles = dynamic(() => import('@/components/Particles'));

export const metadata: Metadata = {
  title: 'VaultPrompt | Prompt Engineering DevTool & Versioning',
  description: 'The ultimate devtool for prompt engineering. Score, version, and refine your AI prompts before you waste tokens. Optimized for OpenAI, Anthropic, and more.',
  keywords: ['prompt engineering', 'prompt version control', 'AI development tools', 'LLM optimization', 'VaultPrompt'],
  authors: [{ name: 'VaultPrompt Team' }],
  openGraph: {
    title: 'VaultPrompt | Prompt Engineering DevTool',
    description: 'Score, version, and refine your prompts before you waste tokens.',
    url: 'https://vaultprompt.com',
    siteName: 'VaultPrompt',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'VaultPrompt | Prompt Engineering DevTool',
    description: 'Score, version, and refine your prompts before you waste tokens.',
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
    name: 'VaultPrompt',
    description: 'The ultimate devtool for prompt engineering. Score, version, and refine your AI prompts.',
    url: 'https://vaultprompt.com',
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
