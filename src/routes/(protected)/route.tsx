import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Flex } from 'antd'
import MainLayout from '@/shared/components/layout/layout'
import { AuthTokenService } from '@/shared/auth/authToken.service'
import { useAuthStore } from '@/shared/auth/auth.store'

export const Route = createFileRoute('/(protected)')({
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
  return (
    <MainLayout>
      <Flex flex={1}>
        <Outlet />
      </Flex>
    </MainLayout>
  )
}
