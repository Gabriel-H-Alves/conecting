import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CircularCarousel from './CircularCarousel'
import ProjectModal from './ProjectModal'

// ============================================================================
// 📌 ONDE ADICIONAR OU EDITAR AS FOTOS E PROJETOS:
// 👉 Abra o arquivo: src/components/Projects/projectsData.ts
//    Lá você encontra a lista PROJECTS pronta para editar!
// ============================================================================
import { PROJECTS, type ProjectItem } from './projectsData'

gsap.registerPlugin(ScrollTrigger)

export default function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [cardWidth, setCardWidth] = useState(420)

  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const titleCharsRef = useRef<(HTMLSpanElement | null)[]>([])
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  const titleText = 'PROJETOS EM DESTAQUE'
  const titleChars = titleText.split('')

  // Ajusta a largura dos cartões de acordo com o tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardWidth(270)
      } else if (window.innerWidth < 1024) {
        setCardWidth(340)
      } else {
        setCardWidth(420)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Animação de Scroll Reveal do Título ao descer a página
  useEffect(() => {
    if (!headerRef.current) return

    const ctx = gsap.context(() => {
      const validChars = titleCharsRef.current.filter(Boolean) as HTMLSpanElement[]

      // Cascata tridimensional de letras do título ao rolar a página
      if (validChars.length > 0) {
        gsap.fromTo(
          validChars,
          {
            y: 70,
            opacity: 0,
            rotateX: -60,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.1,
            stagger: 0.025,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // Subtítulo surge logo após as letras
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          {
            y: 25,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            delay: 0.25,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const activeProject: ProjectItem = PROJECTS[activeIndex] || PROJECTS[0]

  return (
    <section
      ref={sectionRef}
      id="projetos"
      className="relative min-h-screen w-full py-12 sm:py-16 bg-[#000000] text-white overflow-hidden flex flex-col items-center justify-center"
      aria-label="Projetos em Destaque"
    >
      {/* Glow de fundo dinâmico e centralizado */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] rounded-full blur-[170px] opacity-20 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${activeProject.accentColor} 0%, transparent 70%)`,
        }}
      />

      {/* Grid sutil de fundo */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Topo Limpo: Somente o Título com Scroll Reveal Animado */}
      <div
        ref={headerRef}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto mb-2 sm:mb-4 select-none"
      >
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-['Bebas_Neue'] tracking-wider leading-none text-white uppercase flex items-center justify-center flex-wrap">
          {titleChars.map((char, i) => (
            <span key={i} className="inline-block overflow-hidden py-1">
              <span
                ref={(el) => {
                  titleCharsRef.current[i] = el
                }}
                className="inline-block will-change-transform"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            </span>
          ))}
        </h2>
        <p
          ref={subtitleRef}
          className="mt-2 text-xs sm:text-sm font-mono tracking-widest text-neutral-400 uppercase will-change-transform"
        >
          Arraste para girar &bull; Clique no projeto para abrir
        </p>
      </div>

      {/* Componente Circular Carousel Exatamente Centralizado */}
      <div className="relative z-10 w-full h-[520px] sm:h-[580px] flex items-center justify-center">
        <CircularCarousel
          items={PROJECTS}
          preset="cylinder"
          intro="assemble"
          cardWidth={cardWidth}
          aspectRatio={16 / 10}
          gap={20}
          cornerRadius={14}
          captions={true}
          draggable={true}
          focusOnClick={true}
          snap={true}
          onChange={(index) => setActiveIndex(index)}
          onItemClick={(item, index) => {
            const project = PROJECTS[index] || (item as unknown as ProjectItem)
            setSelectedProject(project)
          }}
        />
      </div>

      {/* Modal / Cardzinho Flutuante ao Clicar no Projeto */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  )
}
