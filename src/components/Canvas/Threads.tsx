import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl'

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform float uBaseY;
uniform float uAspect;
uniform vec2 uMouse;

#define PI 3.1415926538

const int u_line_count = 28;
const float u_line_width_px = 1.8;
const float u_line_feather_px = 1.0;

float Perlin2D(vec2 P) {
    vec2 Pi = floor(P);
    vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
    vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
    Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
    Pt += vec2(26.0, 161.0).xyxy;
    Pt *= Pt;
    Pt = Pt.xzxz * Pt.yyww;
    vec4 hash_x = fract(Pt * (1.0 / 951.135664));
    vec4 hash_y = fract(Pt * (1.0 / 642.949883));
    vec4 grad_x = hash_x - 0.49999;
    vec4 grad_y = hash_y - 0.49999;
    vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
        * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
    grad_results *= 1.4142135623730950;
    vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
               * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
    vec4 blend2 = vec4(blend, vec2(1.0 - blend));
    return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

float lineFn(vec2 st, float perc, vec2 mouse, float time, float amplitude, float distance, float baseY, float aspect) {
    // Smooth natural fan opening from the left
    float split_point = 0.04 + (perc * 0.24);
    float amplitude_normal = smoothstep(split_point, 0.65, st.x);
    
    // Balanced wave amplitude — fluid organic motion without colliding with the text
    float ampScale = aspect < 1.0 ? 0.22 : 0.32;
    float finalAmplitude = amplitude_normal * ampScale * amplitude;

    float time_scaled = time / 9.5;

    // Organic 3D thread phase shift (0.35) — restores fluid volumetric curves
    // while keeping threads in a clean parallel laminar ribbon
    float linePhase = perc * 0.32;

    float xnoise = mix(
        Perlin2D(vec2(time_scaled, (st.x + linePhase) * 2.3)),
        Perlin2D(vec2(time_scaled * 1.2, (st.x + time_scaled) * 2.7)) / 1.5,
        st.x * 0.35
    );

    // Height of the thread in the viewport
    float y = baseY + (perc - 0.5) * distance + (xnoise * 0.5 * finalAmplitude);

    // Interactive mouse / touch ripple
    vec2 currentPt = vec2(st.x, y);
    vec2 delta = currentPt - mouse;
    delta.x *= max(aspect, 1.0);
    delta.y *= max(1.0 / aspect, 1.0);
    float dist = length(delta);

    float interactionRadius = aspect < 1.0 ? 0.20 : 0.25;
    if (dist < interactionRadius) {
        float influence = smoothstep(interactionRadius, 0.0, dist);
        float ripple = sin(dist * 26.0 - time * 6.0) * influence * 0.025;
        y += ripple;
    }

    // Razor-sharp physical pixel lines with sub-pixel feather
    float pixelY = 1.0 / iResolution.y;
    float halfWidth = (u_line_width_px * 0.5) * pixelY;
    float feather = u_line_feather_px * pixelY;

    float line_start = smoothstep(y + halfWidth + feather, y, st.y);
    float line_end = smoothstep(y, y - halfWidth - feather, st.y);

    float line_intensity = clamp(line_start - line_end, 0.0, 1.0);
    float depthFade = 1.0 - smoothstep(0.0, 1.0, pow(perc, 0.35)) * 0.35;

    return line_intensity * depthFade;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float result = 0.0;

    for (int i = 0; i < u_line_count; i++) {
        float perc = float(i) / float(u_line_count);
        result += lineFn(uv, perc, uMouse, iTime, uAmplitude, uDistance, uBaseY, uAspect);
    }

    // High-contrast clean white threads on deep black
    vec3 color = uColor * clamp(result, 0.0, 1.0);
    fragColor = vec4(color, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`

interface ThreadsProps {
  color?: [number, number, number]
  amplitude?: number
  distance?: number
  baseY?: number
  enableMouseInteraction?: boolean
  className?: string
}

export default function Threads({
  color = [1, 1, 1],
  amplitude = 1,
  distance = 0.26,
  baseY = 0.26,
  enableMouseInteraction = true,
  className = '',
}: ThreadsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<InstanceType<typeof Renderer> | null>(null)
  const programRef = useRef<InstanceType<typeof Program> | null>(null)
  const animationRef = useRef<number>(0)
  // Default mouse off-canvas initially until interaction
  const mouseRef = useRef({ x: -10, y: -10 })
  const targetMouseRef = useRef({ x: -10, y: -10 })

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    rendererRef.current = renderer

    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 1)
    container.appendChild(gl.canvas as HTMLElement)

    const geometry = new Triangle(gl)

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: [0, 0, 0] },
        uColor: { value: new Color(color[0], color[1], color[2]) },
        uAmplitude: { value: amplitude },
        uDistance: { value: distance },
        uBaseY: { value: baseY },
        uAspect: { value: 1.0 },
        uMouse: { value: [-10, -10] },
      },
    })
    programRef.current = program

    const mesh = new Mesh(gl, { geometry, program })

    function resize() {
      if (!container || !rendererRef.current || !programRef.current) return
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      rendererRef.current.setSize(w, h)

      const aspect = w / h
      const isPortrait = aspect < 1.0

      programRef.current.uniforms.iResolution.value = [w * dpr, h * dpr, 0]
      programRef.current.uniforms.uAspect.value = aspect

      if (isPortrait) {
        // Mobile portrait: ribbon safely anchored in lower third (below text)
        programRef.current.uniforms.uDistance.value = 0.18
        programRef.current.uniforms.uBaseY.value = 0.22
        programRef.current.uniforms.uAmplitude.value = 0.8
      } else {
        // Desktop landscape: expansive ribbon across lower section
        programRef.current.uniforms.uDistance.value = distance
        programRef.current.uniforms.uBaseY.value = baseY
        programRef.current.uniforms.uAmplitude.value = amplitude
      }
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    window.addEventListener('resize', resize)
    resize()

    function handlePointer(e: PointerEvent | MouseEvent | TouchEvent) {
      if (!enableMouseInteraction) return
      let clientX = 0
      let clientY = 0

      if ('touches' in e) {
        if (e.touches.length === 0) return
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = (e as MouseEvent).clientX
        clientY = (e as MouseEvent).clientY
      }

      const rect = container.getBoundingClientRect()
      targetMouseRef.current = {
        x: (clientX - rect.left) / rect.width,
        y: 1.0 - (clientY - rect.top) / rect.height,
      }
    }

    if (enableMouseInteraction) {
      window.addEventListener('pointermove', handlePointer, { passive: true })
      window.addEventListener('pointerdown', handlePointer, { passive: true })
      window.addEventListener('touchmove', handlePointer, { passive: true })
      window.addEventListener('touchstart', handlePointer, { passive: true })
    }

    function animate(t: number) {
      animationRef.current = requestAnimationFrame(animate)

      if (enableMouseInteraction) {
        mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.08
        mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.08
      }

      if (programRef.current) {
        programRef.current.uniforms.iTime.value = t * 0.001
        programRef.current.uniforms.uMouse.value = [
          mouseRef.current.x,
          mouseRef.current.y,
        ]
      }

      rendererRef.current?.render({ scene: mesh })
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
      resizeObserver.disconnect()
      window.removeEventListener('resize', resize)
      if (enableMouseInteraction) {
        window.removeEventListener('pointermove', handlePointer)
        window.removeEventListener('pointerdown', handlePointer)
        window.removeEventListener('touchmove', handlePointer)
        window.removeEventListener('touchstart', handlePointer)
      }
      if (container.contains(gl.canvas as HTMLElement)) {
        container.removeChild(gl.canvas as HTMLElement)
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [color, amplitude, distance, baseY, enableMouseInteraction])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    />
  )
}
