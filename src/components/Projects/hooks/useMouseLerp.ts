import { useRef, useEffect, useCallback } from 'react'

interface MousePosition {
  x: number
  y: number
}

interface UseMouseLerpOptions {
  /** Lerp factor: 0 = no movement, 1 = instant snap. Recommended: 0.06–0.12 */
  factor?: number
  /** Only track when active (avoids unnecessary RAF) */
  enabled?: boolean
}

/**
 * Tracks mouse position with smooth linear interpolation (lerp).
 * Uses requestAnimationFrame for GPU-friendly 60fps updates.
 * Returns refs instead of state to avoid re-renders — read in RAF or GSAP callbacks.
 */
export function useMouseLerp({ factor = 0.08, enabled = true }: UseMouseLerpOptions = {}) {
  const target = useRef<MousePosition>({ x: 0, y: 0 })
  const current = useRef<MousePosition>({ x: 0, y: 0 })
  const rafId = useRef<number>(0)

  const onMouseMove = useCallback((e: MouseEvent) => {
    target.current.x = e.clientX
    target.current.y = e.clientY
  }, [])

  useEffect(() => {
    if (!enabled) return

    const lerp = (start: number, end: number, t: number) => start + (end - start) * t

    const animate = () => {
      current.current.x = lerp(current.current.x, target.current.x, factor)
      current.current.y = lerp(current.current.y, target.current.y, factor)
      rafId.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [enabled, factor, onMouseMove])

  return { target, current }
}
