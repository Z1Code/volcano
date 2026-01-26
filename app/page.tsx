import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'
import Events from '@/components/Events'
import Gallery from '@/components/Gallery'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { SectionsProvider, ConditionalSection } from '@/components/ConditionalSections'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <SectionsProvider>
          <ConditionalSection section="about">
            <About />
          </ConditionalSection>
          <ConditionalSection section="events">
            <Events />
          </ConditionalSection>
          <Gallery />
          <ConditionalSection section="testimonials">
            <Testimonials />
          </ConditionalSection>
        </SectionsProvider>
        <Contact />
      </main>
      <Footer />
    </>
  )
}
