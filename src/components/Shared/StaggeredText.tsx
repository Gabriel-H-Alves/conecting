import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface StaggeredTextProps {
  text: string
  className?: string
  charClassName?: string
  staggerDelay?: number
  duration?: number
  ease?: string
  onAnimationComplete?: () => void
  direction?: 'up' | 'down'
  splitBy?: 'chars' | 'words'
}

/**
 * StaggeredText — High-performance staggered text reveal component.
 * Inspired by React Bits (reactbits.dev).
 * 
 * Splits string with word grouping so words never wrap mid-token on mobile,
 * with each letter/word masked inside an overflow-hidden wrapper,
 * cascading into place with silky-smooth GSAP motion.
 */
export default function StaggeredText({
  text,
  className = '',
  charClassName = '',
  staggerDelay = 0.035,
  duration = 0.8,
  ease = 'power3.out',
  onAnimationComplete,
  direction = 'up',
  splitBy = 'chars',
}: StaggeredTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tokensRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const tokens = tokensRef.current.filter(Boolean) as HTMLSpanElement[]
    if (tokens.length === 0) return

    const initialY = direction === 'up' ? '120%' : '-120%'

    // Reset initial state
    gsap.set(tokens, {
      y: initialY,
      opacity: 0,
      rotateX: direction === 'up' ? -45 : 45,
    })

    const ctx = gsap.context(() => {
      gsap.to(tokens, {
        y: '0%',
        opacity: 1,
        rotateX: 0,
        duration,
        stagger: staggerDelay,
        ease,
        onComplete: onAnimationComplete,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [text, staggerDelay, duration, ease, direction, onAnimationComplete])

  if (splitBy === 'words') {
    const words = text.split(' ')
    return (
      <div
        ref={containerRef}
        className={`inline-flex flex-wrap items-center justify-center gap-[0.35em] ${className}`}
        style={{ perspective: '800px' }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden pb-[0.05em] pt-[0.05em]"
          >
            <span
              ref={(el) => {
                tokensRef.current[i] = el
              }}
              className={`inline-block will-change-transform ${charClassName}`}
            >
              {word}
            </span>
          </span>
        ))}
      </div>
    )
  }

  // Split by characters with word-wrapping protection for mobile screens
  const words = text.split(' ')
  let globalCharIndex = 0

  return (
    <div
      ref={containerRef}
      className={`inline-flex flex-wrap items-center justify-center gap-x-[0.3em] gap-y-[0.1em] ${className}`}
      style={{ perspective: '800px' }}
      aria-label={text}
    >
      {words.map((word, wIdx) => {
        const wordChars = word.split('')
        return (
          <span key={wIdx} className="inline-block whitespace-nowrap">
            {wordChars.map((char, cIdx) => {
              const tokenIdx = globalCharIndex++
              return (
                <span
                  key={cIdx}
                  className="inline-block overflow-hidden pb-[0.08em] pt-[0.08em]"
                >
                  <span
                    ref={(el) => {
                      tokensRef.current[tokenIdx] = el
                    }}
                    className={`inline-block will-change-transform ${charClassName}`}
                  >
                    {char}
                  </span>
                </span>
              )
            })}
          </span>
        )
      })}
    </div>
  )
}
