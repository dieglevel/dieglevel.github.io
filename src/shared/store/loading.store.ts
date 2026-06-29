import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface LoadingState {
  isLoading: boolean
  setLoading: (isLoading: boolean) => void
  clearLoading: () => void
}

export const useLoadingStore = create<LoadingState>()(
  devtools((set) => ({
    isLoading: false,
    setLoading: (isLoading) => set({ isLoading }),
    clearLoading: () => set({ isLoading: false }),
  })),
)
