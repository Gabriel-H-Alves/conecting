import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * ServicesSection — Ultra-clean minimal brutalist layout.
 * Pure typography, generous negative space, and responsive scaling.
 */
export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const panel1Ref = useRef<HTMLDivElement>(null)
  const panel2Ref = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Top divider line wipe
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        )
      }

      // Panel 1 — slide/fade from left
      if (panel1Ref.current) {
        const els = panel1Ref.current.querySelectorAll('[data-animate]')
        gsap.fromTo(
          els,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel1Ref.current,
              start: 'top 75%',
            },
          }
        )
      }

      // Panel 2 — slide/fade from right
      if (panel2Ref.current) {
        const els = panel2Ref.current.querySelectorAll('[data-animate]')
        gsap.fromTo(
          els,
          { x: 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel2Ref.current,
              start: 'top 75%',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="servicos"
      className="relative bg-black text-white w-full overflow-hidden"
      style={{ zIndex: 20 }}
    >
      {/* Top divider line */}
      <div
        ref={dividerRef}
        className="w-full h-[1px] bg-white/15 origin-left"
        style={{ transform: 'scaleX(0)' }}
      />

      <div className="flex flex-col md:flex-row min-h-screen w-full">
        {/* ========================================================
            PANEL 1 — SITES
           ======================================================== */}
        <div
          ref={panel1Ref}
          className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-14 lg:px-20 py-24 md:py-0 border-b md:border-b-0 md:border-r border-white/10 group relative overflow-hidden transition-colors duration-700 hover:bg-white/[0.02]"
        >
          {/* Giant background number */}
          <span
            data-animate
            className="text-white/[0.06] leading-none select-none pointer-events-none absolute top-6 right-6 md:top-10 md:right-10 transition-colors duration-500 group-hover:text-white/[0.12]"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(6rem, 15vw, 15rem)',
            }}
          >
            01
          </span>

          {/* Service Name */}
          <h3
            data-animate
            className="text-white leading-none mb-6 relative z-10 group-hover:translate-x-2 transition-transform duration-500"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
              letterSpacing: '0.03em',
            }}
          >
            SITES
          </h3>

          {/* Provocative line */}
          <p
            data-animate
            className="text-white/65 text-sm sm:text-base md:text-lg max-w-sm sm:max-w-md leading-relaxed relative z-10 group-hover:text-white/95 transition-colors duration-500"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            A primeira impressão do seu cliente dura 0,05 segundos. Faça valer cada pixel.
          </p>

          {/* Minimalist visual indicator */}
          <div
            data-animate
            className="mt-8 sm:mt-10 flex items-center gap-3 relative z-10"
          >
            <div className="w-8 h-[1px] bg-white/30 group-hover:w-14 group-hover:bg-white transition-all duration-500" />
            <span
              className="text-white/35 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase group-hover:text-white/75 transition-colors duration-500"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              Design · Código · Performance
            </span>
          </div>
        </div>

        {/* ========================================================
            PANEL 2 — SEO
           ======================================================== */}
        <div
          ref={panel2Ref}
          className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-14 lg:px-20 py-24 md:py-0 group relative overflow-hidden transition-colors duration-700 hover:bg-white/[0.02]"
        >
          {/* Giant background number */}
          <span
            data-animate
            className="text-white/[0.06] leading-none select-none pointer-events-none absolute top-6 right-6 md:top-10 md:right-10 transition-colors duration-500 group-hover:text-white/[0.12]"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(6rem, 15vw, 15rem)',
            }}
          >
            02
          </span>

          {/* Service Name */}
          <h3
            data-animate
            className="text-white leading-none mb-6 relative z-10 group-hover:translate-x-2 transition-transform duration-500"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
              letterSpacing: '0.03em',
            }}
          >
            SEO
          </h3>

          {/* Provocative line */}
          <p
            data-animate
            className="text-white/65 text-sm sm:text-base md:text-lg max-w-sm sm:max-w-md leading-relaxed relative z-10 group-hover:text-white/95 transition-colors duration-500"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            Esteja no topo exatamente no instante em que seu cliente decide contratar o seu serviço.
          </p>

          {/* Minimalist visual indicator */}
          <div
            data-animate
            className="mt-8 sm:mt-10 flex items-center gap-3 relative z-10"
          >
            <div className="w-8 h-[1px] bg-white/30 group-hover:w-14 group-hover:bg-white transition-all duration-500" />
            <span
              className="text-white/35 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase group-hover:text-white/75 transition-colors duration-500"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              Ranqueamento · Tráfego · Conversão
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

