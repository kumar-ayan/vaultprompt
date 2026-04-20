import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import MockEditor from '@/components/MockEditor'
import Features from '@/components/Features'
import Footer from '@/components/Footer'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="container">
      <Navbar user={user} />
      <Hero />
      <MockEditor />
      <Features />
      <Footer />
    </main>
  )
}
