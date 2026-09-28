import { useState, useCallback } from 'react'
import { useLenis } from '@/hooks/useLenis'
import Threads from '@/components/Canvas/Threads'
import Preloader from '@/components/Shared/Preloader'
import HeroSection from '@/components/Hero/HeroSection'
import ServicesSection from '@/components/Services/ServicesSection'

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  useLenis()

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true)
  }, [])

  return (
    <>
      {/* Preloader with Staggered Text "Construindo seu negócio" */}
      {!isLoaded && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Threads Background — fixed wave ribbon in lower third, smooth time animation */}
      <Threads
        color={[1, 1, 1]}
        amplitude={1}
        distance={0.45}
        baseY={0.32}
        enableMouseInteraction={false}
      />

      {/* HTML Overlay — scrolls on top of the Threads canvas */}
      <main className="relative" style={{ zIndex: 10 }}>
        <HeroSection isLoaded={isLoaded} />
        <ServicesSection />
      </main>
    </>
  )
}
