import { useState, useEffect } from 'react'

export type DeviceTier = 'low' | 'medium' | 'high'

interface DeviceCapability {
  tier: DeviceTier
  isMobile: boolean
  isTouch: boolean
  prefersReducedMotion: boolean
  pixelRatio: number
}

/**
 * Detects device capability for conditional rendering of heavy effects.
 * - 'high': Desktop with good hardware → full WebGL, shaders, cursor effects
 * - 'medium': Mobile or tablets → simplified animations, inline thumbnails
 * - 'low': Low-end or reduced motion → minimal animations
 */
export function useDeviceTier(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>(() => detect())

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onResize = () => setCapability(detect())
    const onMotionChange = () => setCapability(detect())

    window.addEventListener('resize', onResize, { passive: true })
    mql.addEventListener('change', onMotionChange)

    return () => {
      window.removeEventListener('resize', onResize)
      mql.removeEventListener('change', onMotionChange)
    }
  }, [])

  return capability
}

function detect(): DeviceCapability {
  const isMobile = window.innerWidth < 768
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const cores = navigator.hardwareConcurrency || 4
  const isLowEnd = cores <= 4 && isMobile

  let tier: DeviceTier = 'high'
  if (prefersReducedMotion || isLowEnd) tier = 'low'
  else if (isMobile || isTouch) tier = 'medium'

  return {
    tier,
    isMobile,
    isTouch,
    prefersReducedMotion,
    pixelRatio: Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2),
  }
}
