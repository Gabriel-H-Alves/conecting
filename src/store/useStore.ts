import { create } from 'zustand'

interface AppState {
  // Loading state
  isLoaded: boolean
  setLoaded: (v: boolean) => void

  // Scroll progress (0-1)
  scrollProgress: number
  setScrollProgress: (v: number) => void

  // Current active section
  activeSection: string
  setActiveSection: (v: string) => void
}

export const useStore = create<AppState>((set) => ({
  isLoaded: false,
  setLoaded: (v) => set({ isLoaded: v }),

  scrollProgress: 0,
  setScrollProgress: (v) => set({ scrollProgress: v }),

  activeSection: 'hero',
  setActiveSection: (v) => set({ activeSection: v }),
}))
