import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface HeroWavesProps {
  className?: string
}

/**
 * HeroWaves — True 3D Perspective Wave Ribbon built with Three.js.
 * 
 * Features:
 * - Real 3D PerspectiveCamera: 100% responsive across PC, tablet, and mobile.
 * - Extended 36-unit width with 140 points per line: stretches completely across 
 *   ultrawide and 4K displays with zero visible corners or cut ends.
 * - Edge-tapering vertex colors: lines smoothly fade to black at the far extremes.
 * - Interactive mouse / touch 3D raycasting ripple.
 * - Contained strictly inside the HeroSection, naturally scrolling with the page.
 */
export default function HeroWaves({ className = '' }: HeroWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    // Camera with perspective
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, -1.2, 10)
    camera.lookAt(0, 0.5, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    // Wave parameters — width extended to 36 so lines stretch well past all PC screens
    const lineCount = 30
    const pointsPerLine = 140
    const width = 36
    const depthSpan = 5.5

    // Mouse tracking
    const mouse = new THREE.Vector2(-100, -100)
    const targetMouse = new THREE.Vector2(-100, -100)
    const raycaster = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const intersectionPoint = new THREE.Vector3(-100, -100, 0)

    // Create lines
    const lines: THREE.Line[] = []
    const lineBasePositions: Float32Array[] = []

    for (let i = 0; i < lineCount; i++) {
      const perc = i / (lineCount - 1)
      const positions = new Float32Array(pointsPerLine * 3)
      const basePositions = new Float32Array(pointsPerLine * 3)
      const colors = new Float32Array(pointsPerLine * 3)

      // Distribute lines in 3D: in lower half of view, layered in depth
      const baseY = -1.6 + (perc - 0.5) * 1.8
      const baseZ = (perc - 0.5) * depthSpan

      for (let j = 0; j < pointsPerLine; j++) {
        const u = j / (pointsPerLine - 1)
        const x = (u - 0.5) * width
        const y = baseY
        const z = baseZ

        const idx = j * 3
        positions[idx] = x
        positions[idx + 1] = y
        positions[idx + 2] = z

        basePositions[idx] = x
        basePositions[idx + 1] = y
        basePositions[idx + 2] = z

        // Smooth edge fade towards far horizontal ends (dissolves to pure black)
        const edgeDist = Math.abs(u - 0.5) * 2.0 // 0 in center, 1 at ends
        const fade = Math.pow(
          Math.cos(Math.max(0.0, (edgeDist - 0.65) / 0.35) * (Math.PI / 2)),
          1.5
        )

        colors[idx] = fade
        colors[idx + 1] = fade
        colors[idx + 2] = fade
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

      // Line opacity fades near depth extremes
      const opacity = 0.18 + (1.0 - Math.abs(perc - 0.4)) * 0.7
      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: Math.max(0.12, Math.min(0.9, opacity)),
        blending: THREE.AdditiveBlending,
      })

      const line = new THREE.Line(geometry, material)
      scene.add(line)
      lines.push(line)
      lineBasePositions.push(basePositions)
    }

    // Pointer move listener
    function handlePointer(e: PointerEvent | TouchEvent) {
      let clientX = 0
      let clientY = 0

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else if ('clientX' in e) {
        clientX = (e as PointerEvent).clientX
        clientY = (e as PointerEvent).clientY
      }

      const rect = container.getBoundingClientRect()
      targetMouse.x = ((clientX - rect.left) / rect.width) * 2 - 1
      targetMouse.y = -(((clientY - rect.top) / rect.height) * 2 - 1)
    }

    window.addEventListener('pointermove', handlePointer, { passive: true })
    window.addEventListener('touchmove', handlePointer, { passive: true })

    // Resize handler
    function handleResize() {
      if (!container || !renderer || !camera) return
      const w = container.clientWidth
      const h = container.clientHeight
      const aspect = w / h

      camera.aspect = aspect

      // Responsive camera calibration
      if (aspect < 1.0) {
        // Mobile portrait: keep waves framed in lower third
        camera.fov = 52
        camera.position.set(0, -1.8, 12)
        camera.lookAt(0, 0.2, 0)
      } else {
        // Desktop landscape: expansive view across full screen width
        camera.fov = 45
        camera.position.set(0, -1.2, 10)
        camera.lookAt(0, 0.5, 0)
      }

      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)
    handleResize()

    // Animation loop
    let animationFrameId: number

    function animate(currentTime: number) {
      animationFrameId = requestAnimationFrame(animate)
      const time = currentTime * 0.001

      // Smooth mouse lerp
      mouse.x += (targetMouse.x - mouse.x) * 0.08
      mouse.y += (targetMouse.y - mouse.y) * 0.08

      // Cast ray to find mouse point in 3D world space
      raycaster.setFromCamera(mouse, camera)
      raycaster.ray.intersectPlane(plane, intersectionPoint)

      const isMobile = camera.aspect < 1.0
      const amp = isMobile ? 0.35 : 0.65

      // Animate line vertices
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const base = lineBasePositions[i]
        const posAttr = line.geometry.attributes.position as THREE.BufferAttribute
        const arr = posAttr.array as Float32Array
        const perc = i / (lineCount - 1)
        const linePhase = perc * 1.2

        for (let j = 0; j < pointsPerLine; j++) {
          const idx = j * 3
          const bx = base[idx]
          const by = base[idx + 1]

          // 3D Harmonic travelling wave
          const wave1 = Math.sin(bx * 0.38 + time * 1.2 + linePhase) * amp
          const wave2 = Math.cos(bx * 0.22 - time * 0.8 + perc * 0.8) * (amp * 0.55)

          let y = by + wave1 + wave2

          // Mouse / touch 3D ripple deflection
          if (intersectionPoint) {
            const dx = bx - intersectionPoint.x
            const dy = by - intersectionPoint.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const radius = isMobile ? 2.5 : 3.8

            if (dist < radius) {
              const influence = Math.cos((dist / radius) * (Math.PI / 2))
              const ripple = Math.sin(dist * 5.0 - time * 6.0) * influence * 0.25
              y += ripple
            }
          }

          arr[idx + 1] = y
        }

        posAttr.needsUpdate = true
      }

      renderer.render(scene, camera)
    }

    animate(performance.now())

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', handlePointer)
      window.removeEventListener('touchmove', handlePointer)

      lines.forEach((line) => {
        line.geometry.dispose()
        ;(line.material as THREE.Material).dispose()
        scene.remove(line)
      })

      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  )
}
