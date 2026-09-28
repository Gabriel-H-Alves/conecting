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
uniform vec2 uMouse;

#define PI 3.1415926538

const int u_line_count = 40;
const float u_line_width = 7.0;
const float u_line_blur = 10.0;

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

float pixel(float count, vec2 resolution) {
    return (1.0 / max(resolution.x, resolution.y)) * count;
}

float lineFn(vec2 st, float width, float perc, float offset, vec2 mouse, float time, float amplitude, float distance, float baseY) {
    float split_offset = (perc * 0.4);
    float split_point = 0.1 + split_offset;

    float amplitude_normal = smoothstep(split_point, 0.7, st.x);
    float amplitude_strength = 0.45;
    float finalAmplitude = amplitude_normal * amplitude_strength * amplitude;

    float time_scaled = time / 10.0;
    float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;

    float xnoise = mix(
        Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
        Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
        st.x * 0.3
    );

    // Fixed vertical anchor point so the ribbon remains stable in the lower screen section
    float y = baseY + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;

    float line_start = smoothstep(
        y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        y,
        st.y
    );

    float line_end = smoothstep(
        y,
        y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        st.y
    );

    return clamp(
        (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
        0.0,
        1.0
    );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float line_width = u_line_width * pixel(1.0, iResolution.xy);
    float result = 0.0;

    for (int i = 0; i < u_line_count; i++) {
        float perc = float(i) / float(u_line_count);
        result += lineFn(uv, line_width, perc, 0.0, uMouse, iTime, uAmplitude, uDistance, uBaseY);
    }

    vec3 color = uColor * result;
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
  distance = 0.45,
  baseY = 0.32, // Fixed lower position matching user screenshot
  enableMouseInteraction = false,
  className = '',
}: ThreadsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<InstanceType<typeof Renderer> | null>(null)
  const programRef = useRef<InstanceType<typeof Program> | null>(null)
  const animationRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 })

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
        uMouse: { value: [0.5, 0.5] },
      },
    })
    programRef.current = program

    const mesh = new Mesh(gl, { geometry, program })

    function resize() {
      if (!container || !rendererRef.current) return
      const w = container.clientWidth
      const h = container.clientHeight
      rendererRef.current.setSize(w, h)
      if (programRef.current) {
        programRef.current.uniforms.iResolution.value = [
          w * window.devicePixelRatio,
          h * window.devicePixelRatio,
          0,
        ]
      }
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    function handleMouseMove(e: MouseEvent) {
      if (!enableMouseInteraction || !container) return
      const rect = container.getBoundingClientRect()
      targetMouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1.0 - (e.clientY - rect.top) / rect.height,
      }
    }

    function handleTouchMove(e: TouchEvent) {
      if (!enableMouseInteraction || !container || !e.touches[0]) return
      const rect = container.getBoundingClientRect()
      targetMouseRef.current = {
        x: (e.touches[0].clientX - rect.left) / rect.width,
        y: 1.0 - (e.touches[0].clientY - rect.top) / rect.height,
      }
    }

    if (enableMouseInteraction) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('touchmove', handleTouchMove, { passive: true })
    }

    function animate(t: number) {
      animationRef.current = requestAnimationFrame(animate)

      if (enableMouseInteraction) {
        mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05
        mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05
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
      if (enableMouseInteraction) {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('touchmove', handleTouchMove)
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
