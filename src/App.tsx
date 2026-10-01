import { useState, useCallback } from 'react'
import { useLenis } from '@/hooks/useLenis'
import Preloader from '@/components/Shared/Preloader'
import HeroSection from '@/components/Hero/HeroSection'
import ServicesSection from '@/components/Services/ServicesSection'
import ProjectsSection from '@/components/Projects/ProjectsSection'

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

      {/* Main Website Sections — Hero has its own self-contained 3D perspective waves */}
      <main className="relative bg-black" style={{ zIndex: 1 }}>
        <HeroSection isLoaded={isLoaded} />
        <ServicesSection />
        <ProjectsSection />
      </main>
    </>
  )
}
