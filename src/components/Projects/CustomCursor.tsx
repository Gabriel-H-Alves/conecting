import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface CustomCursorProps {
  /** Whether a project is being hovered */
  isHovering: boolean
  /** Accent color of the hovered project */
  accentColor: string
}

/**
 * CustomCursor — Circular cursor overlay that scales up on project hover.
 * 
 * - Default: 12px white ring
 * - Hover: 80px filled circle with "VIEW" text and accent color border
 * - Follows mouse with GSAP quickTo for buttery smoothness
 * - Only rendered on non-touch desktop devices
 */
export default function CustomCursor({ isHovering, accentColor }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const xTo = useRef<gsap.QuickToFunc | null>(null)
  const yTo = useRef<gsap.QuickToFunc | null>(null)

  // Setup quickTo for ultra-smooth following
  useEffect(() => {
    if (!cursorRef.current) return

    xTo.current = gsap.quickTo(cursorRef.current, 'x', { duration: 0.35, ease: 'power3.out' })
    yTo.current = gsap.quickTo(cursorRef.current, 'y', { duration: 0.35, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      xTo.current?.(e.clientX)
      yTo.current?.(e.clientY)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Animate scale and opacity on hover state change
  useEffect(() => {
    if (!cursorRef.current || !textRef.current) return

    if (isHovering) {
      gsap.to(cursorRef.current, {
        width: 80,
        height: 80,
        borderColor: accentColor,
        backgroundColor: 'rgba(255,255,255,0.05)',
        duration: 0.4,
        ease: 'power3.out',
      })
      gsap.to(textRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        delay: 0.1,
        ease: 'power3.out',
      })
    } else {
      gsap.to(cursorRef.current, {
        width: 12,
        height: 12,
        borderColor: 'rgba(255,255,255,0.5)',
        backgroundColor: 'transparent',
        duration: 0.3,
        ease: 'power3.out',
      })
      gsap.to(textRef.current, {
        opacity: 0,
        scale: 0.5,
        duration: 0.2,
        ease: 'power3.out',
      })
    }
  }, [isHovering, accentColor])

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border flex items-center justify-center mix-blend-difference"
      style={{
        width: 12,
        height: 12,
        borderColor: 'rgba(255,255,255,0.5)',
        transform: 'translate(-50%, -50%)',
        willChange: 'transform, width, height',
      }}
    >
      <span
        ref={textRef}
        className="text-[10px] tracking-[0.2em] uppercase text-white font-mono select-none"
        style={{
          fontFamily: '"Inter", sans-serif',
          opacity: 0,
          transform: 'scale(0.5)',
        }}
      >
        VIEW
      </span>
    </div>
  )
}
