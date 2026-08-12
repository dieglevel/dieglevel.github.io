export const authKeys = {
  all: ['auth'] as const,
  signIn: () => [...authKeys.all, 'sign-in'] as const,
  logout: () => [...authKeys.all, 'logout'] as const,
  signUp: () => [...authKeys.all, 'sign-up'] as const,
  refreshToken: () => [...authKeys.all, 'refresh-token'] as const,
}