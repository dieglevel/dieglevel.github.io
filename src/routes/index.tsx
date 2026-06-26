import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/shared/auth/auth.store'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }
  },
})

function RouteComponent() {
  return <div>Hello "/"!</div>
}
