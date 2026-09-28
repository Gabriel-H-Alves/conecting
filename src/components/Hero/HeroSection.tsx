import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface HeroSectionProps {
  isLoaded?: boolean
}

/**
 * HeroSection — Minimal brutalist overlay on top of the Threads canvas.
 * Features mix-blend-mode: difference so that whenever the white threads
 * pass behind the text, the text dynamically inverts into a dark tone.
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
        { y: 90, opacity: 0, rotateX: -65 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.3,
          stagger: 0.04,
        }
      )

      // Line wipe
      if (lineRef.current) {
        tl.fromTo(
          lineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: 'power3.inOut' },
          '-=0.7'
        )
      }

      // Tagline
      if (taglineRef.current) {
        tl.fromTo(
          taglineRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.4'
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
      className="relative flex flex-col items-center justify-center min-h-screen select-none pointer-events-none"
      style={{ zIndex: 10 }}
    >
      {/* Brand Name — with mix-blend-mode difference for dark inversion over threads */}
      <h1
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 'clamp(3.5rem, 15vw, 14rem)',
          letterSpacing: '0.06em',
          lineHeight: 1,
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
        className="mt-4 h-[1px] bg-white/70 origin-left"
        style={{
          width: 'clamp(120px, 30vw, 400px)',
          transform: 'scaleX(0)',
          mixBlendMode: 'difference',
        }}
      />

      {/* Single tagline — short, punchy */}
      <p
        ref={taglineRef}
        className="mt-5 text-white/75 tracking-[0.35em] uppercase text-[10px] md:text-xs"
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ opacity: 0, mixBlendMode: 'difference' }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
