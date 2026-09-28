import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * ServicesSection — Visual-first, minimal text.
 * 
 * Two massive panels that reveal on scroll.
 * Each shows a giant number, service name, and ONE provocative line.
 * The visual weight of the typography IS the design.
 */
export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const panel1Ref = useRef<HTMLDivElement>(null)
  const panel2Ref = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal divider line wipe
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
              start: 'top 70%',
            },
          }
        )
      }

      // Panel 1 — slide from left
      if (panel1Ref.current) {
        const els = panel1Ref.current.querySelectorAll('[data-animate]')
        gsap.fromTo(
          els,
          { x: -80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel1Ref.current,
              start: 'top 75%',
            },
          }
        )
      }

      // Panel 2 — slide from right
      if (panel2Ref.current) {
        const els = panel2Ref.current.querySelectorAll('[data-animate]')
        gsap.fromTo(
          els,
          { x: 80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
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
      className="relative bg-black"
      style={{ zIndex: 20 }}
    >
      {/* Top divider line */}
      <div
        ref={dividerRef}
        className="w-full h-[1px] bg-white/20 origin-left"
        style={{ transform: 'scaleX(0)' }}
      />

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Panel 1 — SITES */}
        <div
          ref={panel1Ref}
          className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 md:py-0 border-b md:border-b-0 md:border-r border-white/10 group cursor-pointer relative overflow-hidden transition-colors duration-700 hover:bg-white/[0.03]"
        >
          {/* Giant number */}
          <span
            data-animate
            className="text-white/[0.07] leading-none select-none pointer-events-none absolute top-4 right-4 md:top-8 md:right-8"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(6rem, 15vw, 16rem)',
            }}
          >
            01
          </span>

          {/* Service name */}
          <h3
            data-animate
            className="text-white leading-none mb-6 relative z-10 group-hover:translate-x-3 transition-transform duration-500"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(3rem, 7vw, 6rem)',
              letterSpacing: '0.03em',
            }}
          >
            SITES
          </h3>

          {/* Provocative line */}
          <p
            data-animate
            className="text-white/60 text-sm md:text-base max-w-xs leading-relaxed relative z-10 group-hover:text-white/90 transition-colors duration-500"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            Seu concorrente já tem um site melhor que o seu.
          </p>

          {/* Visual indicator */}
          <div
            data-animate
            className="mt-8 flex items-center gap-3 relative z-10"
          >
            <div className="w-8 h-[1px] bg-white/30 group-hover:w-16 group-hover:bg-white transition-all duration-500" />
            <span
              className="text-white/30 text-[10px] tracking-[0.3em] uppercase group-hover:text-white/70 transition-colors duration-500"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              Design · Código · Performance
            </span>
          </div>
        </div>

        {/* Panel 2 — SEO */}
        <div
          ref={panel2Ref}
          className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 md:py-0 group cursor-pointer relative overflow-hidden transition-colors duration-700 hover:bg-white/[0.03]"
        >
          {/* Giant number */}
          <span
            data-animate
            className="text-white/[0.07] leading-none select-none pointer-events-none absolute top-4 right-4 md:top-8 md:right-8"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(6rem, 15vw, 16rem)',
            }}
          >
            02
          </span>

          {/* Service name */}
          <h3
            data-animate
            className="text-white leading-none mb-6 relative z-10 group-hover:translate-x-3 transition-transform duration-500"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(3rem, 7vw, 6rem)',
              letterSpacing: '0.03em',
            }}
          >
            SEO
          </h3>

          {/* Provocative line */}
          <p
            data-animate
            className="text-white/60 text-sm md:text-base max-w-xs leading-relaxed relative z-10 group-hover:text-white/90 transition-colors duration-500"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            Se não te acham no Google, você não existe.
          </p>

          {/* Visual indicator */}
          <div
            data-animate
            className="mt-8 flex items-center gap-3 relative z-10"
          >
            <div className="w-8 h-[1px] bg-white/30 group-hover:w-16 group-hover:bg-white transition-all duration-500" />
            <span
              className="text-white/30 text-[10px] tracking-[0.3em] uppercase group-hover:text-white/70 transition-colors duration-500"
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
