import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
const VaultClient = dynamic(() => import('./VaultClient'));
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Vault | Prompt Dashboard',
  description: 'Manage and evaluate your exact prompts',
};

export default function VaultPage() {
  return (
    <main className="container">
      <Navbar />
      <VaultClient />
      <Footer />
    </main>
  );
}
