import React from 'react'
import { ConfigProvider } from 'antd'
import type { ThemeConfig } from 'antd'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import '../debt-page.css'

/** Class gắn vào page và các popup (Modal/Dropdown) để dùng chung biến màu CSS */
export const DEBT_UI_CLASS = 'debt-ui'

const ACCENT = '#c2410c'

/**
 * Bộ màu riêng của module Sổ nợ. Kế thừa theme sáng/tối của app,
 * chỉ ghi đè màu nhấn, chiều cao control (≥ 44px) và — ở chế độ tối —
 * nền/viền tông nâu ấm theo thiết kế.
 */
const buildTheme = (isDark: boolean): ThemeConfig => ({
  token: {
    colorPrimary: ACCENT,
    colorLink: isDark ? '#fdba74' : ACCENT,
    controlHeight: 44,
    controlHeightLG: 48,
    controlHeightSM: 32,
    borderRadius: 10,
    ...(isDark && {
      colorBgLayout: '#16100d',
      colorBgContainer: '#211814',
      colorBgElevated: '#2a1f19',
      colorBorder: '#4a3a2f',
      colorBorderSecondary: '#33271f',
      colorText: '#f5ebe3',
      colorTextSecondary: '#c9b5a6',
      colorTextTertiary: '#b3a091',
      colorPrimaryText: '#fdba74',
      colorPrimaryTextHover: '#fed7aa',
    }),
  },
  components: {
    Modal: isDark ? { contentBg: '#211814', headerBg: '#211814' } : {},
  },
})

export const DebtThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { mode } = useThemeMode()
  return (
    <ConfigProvider theme={buildTheme(mode === 'dark')}>
      {children}
    </ConfigProvider>
  )
}
