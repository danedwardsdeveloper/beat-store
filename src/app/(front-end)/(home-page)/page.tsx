import ContactForm from './components/ContactForm'
import Hero from './components/hero'
import Pricing from './components/Pricing'
import ContactFormNew from '@/components/contactForm'

export default function Home() {
  return (
    <>
      <Hero />
      <Pricing />
      <ContactFormNew />
      <ContactForm />
    </>
  )
}
