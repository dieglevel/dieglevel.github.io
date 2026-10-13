import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { LoginComponent } from '../(public)/(empty-layout)/login'
import MainLayout from '@/shared/components/layout/layout'
import { AuthTokenService } from '@/shared/auth/authToken.service'
import { useAuthStore } from '@/shared/auth/auth.store'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { useGetFinance_Setting_Get } from '@/shared/api/financial/setting/useGetFinance_Setting_Get'
import { useSettingStore } from '@/shared/pages/financial/_store/setting.store'
import SakuraBranch from '@/shared/components/sakura-branch'

export const Route = createFileRoute('/(protected)')({
  component: () => {
    const auth = useAuthStore.getState().isAuthenticated
    if (!auth) {
      return <LoginComponent />
    }
    return <RouteComponent />
  },
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
    <MainLayout>
      <Flex flex={1} vertical style={{ overflowY: 'auto' }}>
        <Outlet />
      </Flex>
    </MainLayout>
  )
}
