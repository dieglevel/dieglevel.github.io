import { theme } from 'antd'
import { colors } from './design-token'
import type { ConfigProviderProps } from 'antd'

const hoverColor = (colorValue: string) => {
  return `color-mix(in srgb, ${colorValue} 90%, transparent)`
}

const activeColor = (colorValue: string) => {
  return `color-mix(in srgb, ${colorValue} 75%, black)`
}

export const ConfigAntd: ConfigProviderProps = {
  theme: {
    algorithm: theme.defaultAlgorithm,
    token: {
      colorTextBase: colors.primary.light,
      colorPrimary: colors.primary.base,
      colorBgContainer: 'var(--background-content, #240101)',
      colorBgSolidHover: hoverColor(colors.primary.base),
      colorBgSolidActive: activeColor(colors.primary.base),
      colorPrimaryBgHover: hoverColor(colors.primary.base),
      fontFamily: `'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif`,
    },
    components: {
      Table: {
        headerBg: colors.primary.base,
        colorBgBase: colors.primary.base,
        colorBgLayout: colors.primary.base,
      },
      Button: {
        defaultColor: colors.primary.base,
        defaultBorderColor: colors.primary.base,
        fontSize: 14,
        fontWeight: 600,
        fontSizeIcon: 14,
      },
      Pagination: {
        itemActiveBg: colors.primary.base,
        itemActiveColor: colors.primary.light,
        itemBg: 'transparent',
      },
      Card: {
        colorBgContainer: 'var(--background-content, #240101)',
        colorBorderSecondary: 'var(--border-color, #4B1010)',
      },
      Input: {
        colorBgContainer: '#FAF6F2',
        // colorTextBase: colors.primary.base,
        colorText: colors.primary.base,
        colorTextPlaceholder: colors.primary[300],
        colorBgTextActive: hoverColor(colors.primary.base),
      },
    },
  },
}
