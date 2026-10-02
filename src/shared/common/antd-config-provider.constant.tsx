import { Flex, theme } from 'antd'
import { getTokens } from './design-token'
import type { ConfigProviderProps } from 'antd'
import type { ThemeMode } from './design-token'

export type { ThemeMode }

const hoverColor = (colorValue: string) => {
  return `color-mix(in srgb, ${colorValue} 90%, transparent)`
}

const activeColor = (colorValue: string) => {
  return `color-mix(in srgb, ${colorValue} 75%, black)`
}

export const getConfigAntd = (mode: ThemeMode): ConfigProviderProps => {
  const isDark = mode === 'dark'
  const { colors, text, background, border, state, shadow } = getTokens(mode)
  const primary = colors.primary

  return {
    renderEmpty: () => {
      return (
        <Flex flex={1} align="center" justify="center">
          No data
        </Flex>
      )
    },
    theme: {
      algorithm: [
        isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        theme.compactAlgorithm,
      ],
      token: {
        colorTextBase: text.brand,
        colorPrimary: primary.base,
        colorBgSolidHover: hoverColor(primary.base),
        colorBgSolidActive: activeColor(primary.base),
        colorPrimaryBgHover: hoverColor(primary.base),
        fontFamily: `'MadimiOne', -apple-system, BlinkMacSystemFont, sans-serif`,

        /* Dark: ghi đè để có tông nâu ấm thay vì xám mặc định của darkAlgorithm.
         * Light giữ nguyên mặc định antd như cấu hình cũ. */
        ...(isDark && {
          colorBgBase: background.base,
          colorBgContainer: background.base,
          colorBgLayout: background.layout,
          colorBgElevated: background.elevated,
          colorBorder: border.base,
          colorBorderSecondary: border.light,
          colorTextSecondary: text.secondary,
          colorTextDisabled: text.disabled,
        }),
      },
      components: {
        Table: {
          headerBg: primary.base,
          colorBgBase: primary.base,
          colorBgLayout: primary.base,
          ...(isDark && {
            rowHoverBg: state.hover,
            rowSelectedBg: state.selected,
            rowSelectedHoverBg: state.click,
          }),
        },
        Button: {
          defaultColor: text.accent,
          defaultBorderColor: primary.base,
          fontSize: 14,
          fontWeight: 600,
          fontSizeIcon: 14,
          boxShadow: shadow.button,
          defaultShadow: 'none',
          primaryShadow: 'none',
        },
        Pagination: {
          itemActiveBg: primary.base,
          itemActiveColor: text.onPrimary,
          itemBg: 'transparent',
        },
        Card: {
          colorBorderSecondary: border.base,
          colorBorder: border.base,
          boxShadow: 'none',
        },
        Input: {
          colorBgContainer: background.input,
          colorText: text.accent,
          colorTextPlaceholder: text.placeholder,
          colorBgTextActive: hoverColor(primary.base),
        },
        Select: {
          colorText: text.accent,
          ...(isDark && {
            optionSelectedBg: state.selected,
            optionActiveBg: state.hover,
          }),
        },
      },
    },
  }
}

/* Giữ tương thích với code cũ đang import ConfigAntd */
export const ConfigAntd = getConfigAntd('light')
