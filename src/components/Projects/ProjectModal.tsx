import { useEffect } from 'react'
import { X, ExternalLink, Sparkles } from 'lucide-react'
import type { ProjectItem } from './projectsData'

interface ProjectModalProps {
  project: ProjectItem | null
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Fecha com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (project) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      {/* Backdrop com blur profundo */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      />

      {/* Cardzinho Flutuante de Detalhes do Projeto */}
      <div
        className="relative z-10 w-full max-w-xl rounded-2xl bg-[#0c0c0e]/95 border border-white/15 p-6 sm:p-7 shadow-[0_0_60px_-10px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 transform animate-scaleUp overflow-hidden"
        style={{
          boxShadow: `0 0 50px -10px ${project.accentColor}30, 0 25px 50px -12px rgba(0, 0, 0, 0.9)`,
        }}
      >
        {/* Glow sutil interno com a cor do projeto */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-30"
          style={{ backgroundColor: project.accentColor }}
        />

        {/* Botão Fechar (X) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar detalhes do projeto"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Imagem do Projeto com Proporção 16:9 */}
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-5 bg-neutral-900 border border-white/10">
          <img
            src={project.image || project.src}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Badge de número e ano sobre a foto */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white font-medium">
              CASE {project.number}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-md text-white/90">
              {project.year}
            </span>
          </div>
        </div>

        {/* Conteúdo textual */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: project.accentColor }}
            />
            <span style={{ color: project.accentColor }} className="font-semibold">
              {project.category}
            </span>
          </div>

          <h3
            id="modal-project-title"
            className="text-3xl sm:text-4xl font-['Bebas_Neue'] tracking-wide text-white leading-none mb-3"
          >
            {project.title}
          </h3>

          <p className="text-neutral-300 text-sm leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-white/[0.04] border border-white/10 text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <a
              href={project.liveUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 group hover:opacity-90 active:scale-95 shadow-md"
              style={{
                backgroundColor: project.accentColor,
                color: '#000000',
              }}
            >
              <span>Acessar Projeto</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-medium text-neutral-400 hover:text-white bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-all active:scale-95"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
