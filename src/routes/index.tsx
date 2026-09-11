import { createFileRoute } from '@tanstack/react-router'
import { StaffOfHoma } from '@/shared/components/staff-of-homa/staff-of-homa'
import { useAuthStore } from '@/shared/auth/auth.store'
import { AuthTokenService } from '@/shared/auth/authToken.service'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: () => {
    const loadToken = AuthTokenService.loadTokens()
    useAuthStore.setState({
      accessToken: loadToken?.accessToken || null,
      refreshToken: loadToken?.refreshToken || null,
      user: loadToken?.user || null,
      isAuthenticated: !!loadToken,
    })
  },
})

function RouteComponent() {
  return <StaffOfHoma />
}
