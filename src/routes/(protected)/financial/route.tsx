import { Outlet, createFileRoute } from '@tanstack/react-router'

import { useAuthStore } from '@/shared/auth/auth.store'
import { LoginComponent } from '@/routes/(public)/login'
import WalletLayout from '@/shared/pages/financial/_layout'

export const Route = createFileRoute('/(protected)/financial')({
  component: () => {
    const auth = useAuthStore.getState().isAuthenticated
    if (!auth) {
      return <LoginComponent />
    }
    return <RouteComponent />
  },
})

export function RouteComponent() {
  return (
    <>
      <WalletLayout>
        <Outlet />
      </WalletLayout>
    </>
  )
}
