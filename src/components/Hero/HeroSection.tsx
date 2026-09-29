import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import HeroWaves from './HeroWaves'

interface HeroSectionProps {
  isLoaded?: boolean
}

/**
 * HeroSection — Minimal brutalist overlay with self-contained 3D perspective waves.
 * 
 * The 3D waves are contained strictly inside this section and scroll naturally with the page.
 * Features mix-blend-mode: difference for dark contrast inversion if waves ever pass behind text.
 */
export default function HeroSection({ isLoaded = true }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null)
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([])
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const brandName = 'CONECTING'

  // Entry animation triggered when preloader finishes
  useEffect(() => {
    if (!isLoaded || !containerRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        delay: 0.1,
      })

      // Letters cascade in
      tl.fromTo(
        lettersRef.current.filter(Boolean),
        { y: 80, opacity: 0, rotateX: -60 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.035,
        }
      )

      // Line wipe
      if (lineRef.current) {
        tl.fromTo(
          lineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.75, ease: 'power3.inOut' },
          '-=0.65'
        )
      }

      // Tagline
      if (taglineRef.current) {
        tl.fromTo(
          taglineRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.35'
        )
      }

      // Scroll indicator
      if (scrollRef.current) {
        tl.fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.2'
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isLoaded])

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 select-none w-full overflow-hidden bg-black"
    >
      {/* 3D Perspective Wave Ribbon — contained inside HeroSection, scrolls with page */}
      <HeroWaves />

      {/* Brand Name Typography */}
      <h1
        className="relative z-10 flex items-center justify-center overflow-hidden max-w-full whitespace-nowrap pointer-events-none"
        style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 'clamp(2.75rem, 14.5vw, 14rem)',
          letterSpacing: '0.04em',
          lineHeight: 0.95,
          perspective: '600px',
          mixBlendMode: 'difference',
        }}
      >
        {brandName.split('').map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              lettersRef.current[i] = el
            }}
            className="inline-block text-white will-change-transform"
            style={{ opacity: 0 }}
          >
            {char}
          </span>
        ))}
      </h1>

      {/* Divider */}
      <div
        ref={lineRef}
        className="relative z-10 mt-3 sm:mt-4 h-[1px] bg-white/70 origin-left pointer-events-none"
        style={{
          width: 'clamp(90px, 26vw, 380px)',
          transform: 'scaleX(0)',
          mixBlendMode: 'difference',
        }}
      />

      {/* Single tagline */}
      <p
        ref={taglineRef}
        className="relative z-10 mt-4 sm:mt-5 text-white/75 tracking-[0.25em] sm:tracking-[0.35em] uppercase text-[9px] sm:text-xs whitespace-nowrap text-center pointer-events-none"
        style={{
          fontFamily: '"Inter", sans-serif',
          opacity: 0,
          mixBlendMode: 'difference',
        }}
      >
        Sites &nbsp;·&nbsp; SEO &nbsp;·&nbsp; Resultados
      </p>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="relative z-10 absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
        style={{ opacity: 0, mixBlendMode: 'difference' }}
      >
        <div className="w-[1px] h-8 sm:h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
