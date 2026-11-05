import useReveal from './hooks/useReveal'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Widgets from './components/Widgets'
import ClaudeImport from './components/ClaudeImport'
import Download from './components/Download'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import Splash from './components/Splash'

export default function App() {
  useReveal()

  return (
    <div className="min-h-dvh overflow-x-clip">
      <Splash />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Widgets />
        <ClaudeImport />
        <Download />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
