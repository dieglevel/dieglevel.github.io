import { Outlet, createFileRoute } from '@tanstack/react-router'

import { useAuthStore } from '@/shared/auth/auth.store'
import { LoginComponent } from '@/routes/(public)/(empty-layout)/login'
import WalletLayout from '@/shared/pages/financial/_layout'
import { useGetFinance_Setting_Get } from '@/shared/api/financial/setting/useGetFinance_Setting_Get'
import { useSettingStore } from '@/shared/pages/financial/_store/setting.store'

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
  const { data } = useGetFinance_Setting_Get({})

  if (!data) {
    return <div>Loading...</div>
  } else {
    useSettingStore.getState().set(data.data)
  }

  return (
    <WalletLayout>
      <Outlet />
    </WalletLayout>
  )
}
