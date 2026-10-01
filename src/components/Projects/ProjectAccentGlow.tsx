import { useRef, useEffect } from 'react'

interface ProjectAccentGlowProps {
  /** Accent color for the radial gradient */
  color: string
  /** Whether the glow is visible */
  isVisible: boolean
}

/**
 * ProjectAccentGlow — Radial gradient that blooms behind the project list on hover.
 * Creates an ambient light effect tied to each project's accent color.
 * Uses CSS transition for smooth color and opacity shifts.
 */
export default function ProjectAccentGlow({ color, isVisible }: ProjectAccentGlowProps) {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!glowRef.current) return
    glowRef.current.style.background = `radial-gradient(ellipse 60% 50% at 70% 50%, ${color}09 0%, transparent 70%)`
  }, [color])

  return (
    <div
      ref={glowRef}
      className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        willChange: 'opacity',
      }}
    />
  )
}
