import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import StaggeredText from './StaggeredText'

interface PreloaderProps {
  onComplete: () => void
}

/**
 * Preloader — Staggered Text loading screen.
 * Displays "Construindo seu negócio" via React Bits inspired staggered reveal,
 * accompanied by a minimalist brutalist progress counter (0-100%) and curtain wipe.
 */
export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const brandSubRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete()
        },
      })

      // Animate progress 0 -> 100
      const counterObj = { val: 0 }
      tl.to(counterObj, {
        val: 100,
        duration: 2.0,
        ease: 'power2.inOut',
        onUpdate: () => {
          const current = Math.round(counterObj.val)
          setProgress(current)
          if (counterRef.current) {
            counterRef.current.textContent = current.toString().padStart(2, '0')
          }
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${current}%`
          }
        },
      })

      // Sub-brand badge reveal
      if (brandSubRef.current) {
        tl.fromTo(
          brandSubRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          0.3
        )
      }

      // Brief hold at 100% for emotional impact
      tl.to({}, { duration: 0.35 })

      // Exit transition: elements fade and elevate
      tl.to(
        [
          containerRef.current?.querySelector('.staggered-wrapper'),
          counterRef.current,
          progressBarRef.current?.parentElement,
          brandSubRef.current,
        ].filter(Boolean),
        {
          opacity: 0,
          y: -25,
          duration: 0.5,
          ease: 'power3.in',
          stagger: 0.05,
        }
      )

      // Curtain slides up smoothly
      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between px-6 py-12 bg-black select-none pointer-events-auto"
      style={{ willChange: 'transform' }}
    >
      {/* Top subtle badge */}
      <div
        ref={brandSubRef}
        className="w-full flex justify-between items-center text-xs tracking-[0.3em] uppercase text-white/40"
        style={{ fontFamily: '"Inter", sans-serif' }}
      >
        <span>CONECTING</span>
        <span className="hidden sm:inline">DIGITAL ARCHITECTURE</span>
        <span>BR · {progress}%</span>
      </div>

      {/* Center: Staggered Text "Construindo seu negócio" */}
      <div className="staggered-wrapper flex flex-col items-center text-center max-w-4xl">
        <p
          className="text-white/40 uppercase tracking-[0.4em] text-xs mb-4"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          Carregando Experiência
        </p>

        <StaggeredText
          text="CONSTRUINDO SEU NEGÓCIO"
          splitBy="chars"
          staggerDelay={0.03}
          duration={0.9}
          className="text-white text-2xl sm:text-4xl md:text-6xl font-bold tracking-tight px-2"
          charClassName="font-display tracking-[0.04em] text-white"
        />

        <div className="mt-8 w-48 sm:w-64 h-[1px] bg-white/10 overflow-hidden relative">
          <div
            ref={progressBarRef}
            className="h-full bg-white transition-all duration-75 ease-out"
            style={{ width: '0%' }}
          />
        </div>
      </div>

      {/* Bottom giant counter */}
      <div className="w-full flex justify-between items-end">
        <span
          className="text-white/20 text-xs tracking-[0.2em] uppercase"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          Sites &amp; SEO de Elite
        </span>

        <span
          ref={counterRef}
          className="text-white/20 text-7xl sm:text-9xl font-light leading-none"
          style={{ fontFamily: '"Bebas Neue", sans-serif' }}
        >
          00
        </span>
      </div>
    </div>
  )
}
