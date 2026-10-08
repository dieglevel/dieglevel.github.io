import { Outlet, createFileRoute } from '@tanstack/react-router'

import { Flex } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/shared/auth/auth.store'
import { LoginComponent } from '@/routes/(public)/(empty-layout)/login'
import WalletLayout from '@/shared/pages/financial/_layout'
import { useGetFinance_Setting_Get } from '@/shared/api/financial/setting/useGetFinance_Setting_Get'
import { useSettingStore } from '@/shared/pages/financial/_store/setting.store'
import SakuraBranch from '@/shared/components/sakura-branch'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'

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
  const { setMode } = useThemeMode()
  const { i18n } = useTranslation()

  useEffect(() => {
    if (data?.data) {
      useSettingStore.getState().set(data.data)
      setMode(data.data.themeMode)
      i18n.changeLanguage(data.data.language)
    }
  }, [data])

  if (!data) {
    return (
      <Flex justify="center" align="center" style={{ height: '100%' }}>
        <SakuraBranch size={160} />
      </Flex>
    )
  }

  return (
    <WalletLayout>
      <Outlet />
    </WalletLayout>
  )
}
