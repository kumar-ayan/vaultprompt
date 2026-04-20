import Navbar from '@/components/Navbar'
import PricingHero from '@/components/pricing/PricingHero'
import PricingCards from '@/components/pricing/PricingCards'
import PricingFAQ from '@/components/pricing/PricingFAQ'
import Footer from '@/components/Footer'

export default function PricingPage() {
  return (
    <main className="container">
      <Navbar />
      <PricingHero />
      <PricingCards />
      <PricingFAQ />
      <Footer />
    </main>
  )
}
