import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/shared/auth/auth.store'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }
    throw redirect({
      to: '/financial',
    })
  },
})
