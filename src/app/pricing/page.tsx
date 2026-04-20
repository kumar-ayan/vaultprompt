import { createClient } from '@/utils/supabase/server'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PricingHero from '@/components/pricing/PricingHero'
import PricingCards from '@/components/pricing/PricingCards'
import PricingFAQ from '@/components/pricing/PricingFAQ'
import PricingCTA from '@/components/pricing/PricingCTA'

export const metadata: Metadata = {
  title: 'Pricing | VaultPrompt',
  description:
    'Simple, transparent pricing for serious prompt engineering. Start free, scale with confidence.',
}

export default async function PricingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="container">
      <Navbar user={user} />
      <PricingHero />
      <PricingCards />
      <PricingFAQ />
      <PricingCTA />
      <Footer />
    </main>
  )
}
