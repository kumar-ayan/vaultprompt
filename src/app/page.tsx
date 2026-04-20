import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import MockEditor from '@/components/MockEditor'
import Features from '@/components/Features'
import Footer from '@/components/Footer'

export default async function Home() {
  return (
    <main className="container">
      <Navbar />
      <Hero />
      <MockEditor />
      <Features />
      <Footer />
    </main>
  )
}
