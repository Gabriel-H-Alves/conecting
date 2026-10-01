import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from './data'

interface ProjectRowProps {
  project: Project
  index: number
  isActive: boolean
  isMobile: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

/**
 * ProjectRow — A single project item in the editorial list.
 * 
 * Desktop: Editorial row with number, title, category, year, arrow.
 *          Hover triggers cursor image externally.
 *          Accent color bleeds into title on hover.
 * 
 * Mobile:  Card layout with inline thumbnail image, title, tags.
 *          Tap to view full project.
 */
export default function ProjectRow({
  project,
  index,
  isActive,
  isMobile,
  onMouseEnter,
  onMouseLeave,
}: ProjectRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  // Hover animation: accent color on title, number glow
  useEffect(() => {
    if (isMobile || !titleRef.current || !numberRef.current) return

    if (isActive) {
      gsap.to(titleRef.current, {
        color: project.accentColor,
        x: 8,
        duration: 0.5,
        ease: 'power3.out',
      })
      gsap.to(numberRef.current, {
        color: project.accentColor,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
      })
    } else {
      gsap.to(titleRef.current, {
        color: '#FFFFFF',
        x: 0,
        duration: 0.4,
        ease: 'power3.out',
      })
      gsap.to(numberRef.current, {
        color: 'rgba(255,255,255,0.2)',
        opacity: 1,
        duration: 0.3,
        ease: 'power3.out',
      })
    }
  }, [isActive, isMobile, project.accentColor])

  // Mobile: image scale parallax on scroll (will be triggered by parent)
  useEffect(() => {
    if (!isMobile || !imageRef.current) return
    // Image starts slightly zoomed and normalizes as it enters viewport
    gsap.set(imageRef.current.querySelector('img'), { scale: 1.1 })
  }, [isMobile])

  if (isMobile) {
    return (
      <article
        ref={rowRef}
        className="border-b border-white/10 py-8"
        role="listitem"
        aria-label={`Projeto: ${project.title}`}
      >
        {/* Mobile: Inline thumbnail */}
        <div ref={imageRef} className="w-full aspect-[16/10] rounded-lg overflow-hidden mb-6 relative">
          <img
            src={project.image}
            alt={`Screenshot do projeto ${project.title}`}
            className="w-full h-full object-cover"
            loading="lazy"
            style={{ transform: 'scale(1.1)', willChange: 'transform' }}
          />
          {/* Gradient overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {/* Accent border */}
          <div
            className="absolute bottom-0 left-0 w-full h-[2px]"
            style={{ backgroundColor: project.accentColor }}
          />
        </div>

        {/* Number + Title */}
        <div className="flex items-start gap-4 mb-3">
          <span
            className="text-xs font-mono mt-1.5"
            style={{
              fontFamily: '"Inter", sans-serif',
              color: project.accentColor,
              opacity: 0.7,
            }}
          >
            {project.number}
          </span>
          <div>
            <h3
              className="text-white leading-none tracking-wide"
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: 'clamp(2rem, 6vw, 3rem)',
              }}
            >
              {project.title}
            </h3>
            <span
              className="inline-block mt-1.5 text-white/40 text-xs tracking-wider uppercase"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              {project.category} · {project.year}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-white/60 text-sm leading-relaxed mb-4 pl-8"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pl-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border rounded"
              style={{
                fontFamily: '"Inter", sans-serif',
                color: `${project.accentColor}CC`,
                borderColor: `${project.accentColor}25`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    )
  }

  // Desktop layout
  return (
    <article
      ref={rowRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group border-b border-white/10 cursor-pointer py-8 sm:py-10 md:py-12 transition-colors duration-500 hover:bg-white/[0.015]"
      role="listitem"
      aria-label={`Projeto: ${project.title}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Number + Title */}
        <div className="flex items-start md:items-center gap-6 sm:gap-10">
          <span
            ref={numberRef}
            className="text-sm sm:text-base font-mono"
            style={{
              fontFamily: '"Inter", sans-serif',
              color: 'rgba(255,255,255,0.2)',
              transition: 'none', // GSAP handles this
            }}
          >
            {project.number}
          </span>

          <div>
            <h3
              ref={titleRef}
              className="text-white leading-none tracking-wide"
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                willChange: 'transform, color',
              }}
            >
              {project.title}
            </h3>
            <span
              className="inline-block mt-2 text-white/40 text-xs sm:text-sm tracking-wider uppercase transition-colors duration-500 group-hover:text-white/60"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              {project.category}
            </span>
          </div>
        </div>

        {/* Right: Year + Arrow */}
        <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-10">
          <span
            className="text-white/30 text-xs sm:text-sm font-mono transition-colors duration-500 group-hover:text-white/60"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            {project.year}
          </span>

          <div
            className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500"
            style={{
              borderColor: isActive ? project.accentColor : 'rgba(255,255,255,0.2)',
              backgroundColor: isActive ? project.accentColor : 'transparent',
              color: isActive ? '#000000' : 'rgba(255,255,255,0.4)',
              transform: isActive ? 'rotate(45deg)' : 'rotate(0deg)',
            }}
          >
            <ArrowUpRight size={18} strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Expanded Details — revealed on hover with spring-like animation */}
      <div
        className="grid overflow-hidden transition-all duration-500 ease-out"
        style={{
          gridTemplateRows: isActive ? '1fr' : '0fr',
          opacity: isActive ? 1 : 0,
          paddingTop: isActive ? '1.5rem' : 0,
        }}
      >
        <div className="min-h-0 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/[0.06] pt-4">
          <p
            className="text-white/70 text-xs sm:text-sm max-w-xl leading-relaxed"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-wider border rounded transition-colors duration-300"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  color: isActive ? `${project.accentColor}CC` : 'rgba(255,255,255,0.6)',
                  borderColor: isActive ? `${project.accentColor}25` : 'rgba(255,255,255,0.1)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
