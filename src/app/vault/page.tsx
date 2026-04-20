import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VaultWrapper from './VaultWrapper';
// Static type hint so the TS language server resolves VaultClient correctly
import type { } from './VaultClient';

export const metadata = {
  title: 'Event Copilot | EventPilot',
  description: 'Your AI copilot for physical events. Generate personalized itineraries, discover sessions, and get networking icebreakers in real time.',
};

export default function VaultPage() {
  return (
    <main className="container">
      <Navbar />
      {/* VaultWrapper is a Client Component that uses dynamic() with ssr:false,
          preventing hydration mismatches from localStorage reads */}
      <VaultWrapper />
      <Footer />
    </main>
  );
}
