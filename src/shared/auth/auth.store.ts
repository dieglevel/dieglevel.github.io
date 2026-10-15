import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { IProfile } from '../api/profile/profile.type'

interface AuthState {
  user: IProfile | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (auth: {
    user: IProfile | null
    accessToken: string
    refreshToken?: string
    isAuthenticated: boolean
  }) => void
  clearAuth: () => void
  setUser: (user: IProfile | null) => void
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,

    setAuth: ({ user, accessToken, refreshToken, isAuthenticated }) =>
      set({ user, accessToken, refreshToken, isAuthenticated }),
    setUser: (user) => set({ user }),

    clearAuth: () =>
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      }),
  })),
)
