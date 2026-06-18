import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { User } from '../auth/auth.type'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (auth: {
    user: User
    accessToken: string
    refreshToken?: string
    isAuthenticated: boolean
  }) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,

    setAuth: ({ user, accessToken, refreshToken, isAuthenticated }) =>
      set({ user, accessToken, refreshToken, isAuthenticated }),

    clearAuth: () =>
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      }),
  })),
)
