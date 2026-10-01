/**
 * =====================================================================
 * 📁 CONFIGURAÇÃO DE PROJETOS E FOTOS DO PORTFÓLIO
 * =====================================================================
 * 
 * 💡 COMO ADICIONAR OU EDITAR UM PROJETO:
 * 1. Coloque a foto do projeto na pasta: `public/images/projects/`
 *    (Exemplo: `meu-projeto.jpg`)
 * 2. Adicione ou edite um item na lista `PROJECTS` abaixo.
 * 3. O Circular Carousel atualizará automaticamente com a foto e os dados!
 * 
 * =====================================================================
 */

export interface ProjectItem {
  id: string
  number: string
  title: string
  subtitle: string
  category: string
  year: string
  description: string
  tags: string[]
  src: string            // Foto para o Circular Carousel (ex: '/images/projects/foto.jpg')
  image: string          // Alias para src
  alt: string            // Texto alternativo da foto
  accentColor: string    // Cor de destaque usada em glow e badges
  liveUrl?: string       // Link do site em produção (opcional)
  githubUrl?: string     // Link do repositório (opcional)
  [key: string]: any
}

export const PROJECTS: ProjectItem[] = [
  {
    id: '01',
    number: '01',
    title: 'NEXUS PLATFORM',
    subtitle: 'SaaS & Engenharia de Software',
    category: 'SaaS & Engenharia de Software',
    year: '2025',
    description:
      'Plataforma analítica corporativa de alta densidade desenvolvida em React e TypeScript. Foco em performance 99+, arquitetura modular e visualização de métricas em tempo real.',
    tags: ['React 19', 'TypeScript', 'Tailwind', 'Performance 99+'],
    src: '/images/projects/nexus-platform.jpg',
    image: '/images/projects/nexus-platform.jpg',
    alt: 'Nexus Platform - SaaS Dashboard',
    accentColor: '#00D4FF',
    liveUrl: '#',
  },
  {
    id: '02',
    number: '02',
    title: 'ATELIER MONOCHROME',
    subtitle: 'E-Commerce & Design Conceito',
    category: 'E-Commerce & Design Conceito',
    year: '2024',
    description:
      'Interface minimalista de luxo projetada com foco em desejo visual e conversão direta. Transições fluidas com GSAP, estética editorial refinada e tipografia imponente.',
    tags: ['UI/UX Editorial', 'Next.js', 'GSAP Motion', 'E-commerce'],
    src: '/images/projects/atelier-monochrome.jpg',
    image: '/images/projects/atelier-monochrome.jpg',
    alt: 'Atelier Monochrome - E-Commerce de Luxo',
    accentColor: '#E2B86C',
    liveUrl: '#',
  },
  {
    id: '03',
    number: '03',
    title: 'AURORA AI STUDIO',
    subtitle: 'Inteligência Artificial & Creative Suite',
    category: 'Inteligência Artificial & Creative Suite',
    year: '2025',
    description:
      'Studio generativo multimídia com canvas infinito e aceleração WebGL. Interface dark mode com feedbacks táteis e microinterações cinematográficas premiadas.',
    tags: ['WebGL', 'AI Generativa', 'Tailwind', 'Motion UI'],
    src: '/images/projects/aurora-ai.jpg',
    image: '/images/projects/aurora-ai.jpg',
    alt: 'Aurora AI Studio - Generative Suite',
    accentColor: '#A855F7',
    liveUrl: '#',
  },
  {
    id: '04',
    number: '04',
    title: 'CHRONOS ASSETS',
    subtitle: 'Fintech & Gestão de Criptoativos',
    category: 'Fintech & Gestão de Criptoativos',
    year: '2024',
    description:
      'Dashboard financeiro internacional para monitoramento de portfólios descentralizados. Microanimações de dados em tempo real, renderização otimizada e segurança de ponta.',
    tags: ['Fintech', 'Chart.js', 'React Query', 'Alta Segurança'],
    src: '/images/projects/chronos-pay.jpg',
    image: '/images/projects/chronos-pay.jpg',
    alt: 'Chronos Assets - Fintech Dashboard',
    accentColor: '#10B981',
    liveUrl: '#',
  },
  {
    id: '05',
    number: '05',
    title: 'VANGUARD ADVISORY',
    subtitle: 'Institucional & Arquitetura de SEO',
    category: 'Institucional & Arquitetura de SEO',
    year: '2024',
    description:
      'Portal institucional de alto padrão estruturado para máxima autoridade orgânica. Código semântico limpo, Core Web Vitals perfeitos e captação de clientes qualificados.',
    tags: ['SEO Técnico', 'Next.js', 'Core Web Vitals', 'Geração de Leads'],
    src: '/images/projects/vanguard-advisory.jpg',
    image: '/images/projects/vanguard-advisory.jpg',
    alt: 'Vanguard Advisory - Portal Institucional SEO',
    accentColor: '#38BDF8',
    liveUrl: '#',
  },
]
