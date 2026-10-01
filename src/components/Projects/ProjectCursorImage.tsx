import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'

interface ProjectCursorImageProps {
  /** Image source URL */
  src: string
  /** Alt text for the image */
  alt: string
  /** Whether this image should be visible */
  isVisible: boolean
  /** Accent color for the glow border */
  accentColor: string
}

/**
 * ProjectCursorImage — Image that follows the cursor with lerp delay.
 * 
 * Features:
 * - Follows mouse with GSAP quickTo (smooth interpolation)
 * - Reveals with clip-path animation
 * - Subtle 3D tilt based on cursor position
 * - Scale + blur transition on enter/exit
 * - Accent color glow shadow
 * - Positioned to the right of the cursor to avoid text overlap
 */
export default function ProjectCursorImage({
  src,
  alt,
  isVisible,
  accentColor,
}: ProjectCursorImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const xTo = useRef<gsap.QuickToFunc | null>(null)
  const yTo = useRef<gsap.QuickToFunc | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Setup quickTo for smooth following
  useEffect(() => {
    if (!containerRef.current || !innerRef.current) return

    xTo.current = gsap.quickTo(containerRef.current, 'x', { duration: 0.6, ease: 'power3.out' })
    yTo.current = gsap.quickTo(containerRef.current, 'y', { duration: 0.6, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      // Position: offset to the right and slightly above cursor
      xTo.current?.(e.clientX + 20)
      yTo.current?.(e.clientY - 120)

      // Tilt: calculate based on viewport center for subtle 3D feel
      if (innerRef.current) {
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        const tiltX = ((e.clientY - centerY) / centerY) * -4
        const tiltY = ((e.clientX - centerX) / centerX) * 4
        innerRef.current.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Animate visibility with clip-path reveal
  useEffect(() => {
    if (!containerRef.current) return

    if (isVisible && loaded) {
      gsap.to(containerRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
      })
      // Subtle parallax scale on the image itself
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
        })
      }
    } else {
      gsap.to(containerRef.current, {
        clipPath: 'inset(8% 15% 8% 15%)',
        scale: 0.95,
        opacity: 0,
        duration: 0.35,
        ease: 'power3.in',
      })
      if (imageRef.current) {
        gsap.set(imageRef.current, { scale: 1.12 })
      }
    }
  }, [isVisible, loaded])

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 pointer-events-none z-[100]"
      style={{
        width: 420,
        height: 280,
        clipPath: 'inset(8% 15% 8% 15%)',
        opacity: 0,
        willChange: 'transform, clip-path, opacity',
      }}
    >
      <div
        ref={innerRef}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{
          transition: 'transform 0.3s ease-out',
          boxShadow: `0 25px 70px -20px ${accentColor}40, 0 0 0 1px ${accentColor}15`,
        }}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className="w-full h-full object-cover"
          style={{
            transform: 'scale(1.12)',
            willChange: 'transform',
          }}
        />
        {/* Accent gradient overlay at bottom for contrast */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${accentColor}15, transparent)`,
          }}
        />
      </div>
    </div>
  )
}
