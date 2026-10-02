/* =====================================================
 * DESIGN TOKENS — LIGHT & DARK (single source of truth)
 *
 * Cấu trúc:
 *   1. scales  : thang màu thô (50 → 900) cho từng mode
 *   2. roles   : mỗi vai trò (base/hover/active/soft/text) trỏ tới 1 bậc
 *   3. build   : sinh ra token semantic, dùng qua getTokens(mode)
 *
 * Thêm/đổi màu chỉ cần sửa `scales` và `roles`.
 * ===================================================== */

export type ThemeMode = 'light' | 'dark'

type Step = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
type Scale = Record<Step, string>
type ColorName =
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'success'
  | 'error'
  | 'warning'
type Role = 'base' | 'hover' | 'active' | 'soft' | 'text'
type Roles = Record<Role, Step>

/* ================= 1. SCALES ================= */
/* Dark: thang đảo ngược (50 = tối nhất, 900 = sáng nhất) */

const scales: Record<ThemeMode, Record<ColorName, Scale>> = {
  light: {
    primary: {
      50: '#FFF5F0',
      100: '#FEE8DE',
      200: '#FDD0BE',
      300: '#FBB79E',
      400: '#F89A76',
      500: '#F27A4E',
      600: '#E45A2B',
      700: '#C9471C',
      800: '#A73A18',
      900: '#7A2A12',
    },
    secondary: {
      50: '#FCFAF8',
      100: '#F8F4F1',
      200: '#EFE3DC',
      300: '#E0CFC4',
      400: '#C6B0A2',
      500: '#9E8678',
      600: '#735A4C',
      700: '#4B2415',
      800: '#34180E',
      900: '#2F1A10',
    },
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
  },
  dark: {
    primary: {
      50: '#2A120A',
      100: '#3A1A0E',
      200: '#5A2410',
      300: '#7A2A12',
      400: '#A73A18',
      500: '#C9471C',
      600: '#E45A2B',
      700: '#F27A4E',
      800: '#F89A76',
      900: '#FBB79E',
    },
    secondary: {
      50: '#1A0F0A',
      100: '#241510',
      200: '#33201A',
      300: '#4A3126',
      400: '#6B5244',
      500: '#8F7566',
      600: '#B8A396',
      700: '#D9C9BE',
      800: '#EDE2DA',
      900: '#F8F4F1',
    },
    neutral: {
      50: '#0F0F0F',
      100: '#171717',
      200: '#262626',
      300: '#404040',
      400: '#525252',
      500: '#737373',
      600: '#A3A3A3',
      700: '#D4D4D4',
      800: '#E5E5E5',
      900: '#FAFAFA',
    },
    success: {
      50: '#052E16',
      100: '#14532D',
      200: '#166534',
      300: '#15803D',
      400: '#16A34A',
      500: '#22C55E',
      600: '#4ADE80',
      700: '#86EFAC',
      800: '#BBF7D0',
      900: '#DCFCE7',
    },
    error: {
      50: '#450A0A',
      100: '#7F1D1D',
      200: '#991B1B',
      300: '#B91C1C',
      400: '#DC2626',
      500: '#EF4444',
      600: '#F87171',
      700: '#FCA5A5',
      800: '#FECACA',
      900: '#FEE2E2',
    },
    warning: {
      50: '#451A03',
      100: '#78350F',
      200: '#92400E',
      300: '#B45309',
      400: '#D97706',
      500: '#F59E0B',
      600: '#FBBF24',
      700: '#FCD34D',
      800: '#FDE68A',
      900: '#FEF3C7',
    },
  },
}

/* ================= 2. ROLES ================= */
/*  base/hover/active : màu nền của nút, link, ...
 *  soft              : nền nhạt (badge, alert)
 *  text              : màu chữ cùng tông, đọc được trên nền thường */

const statusRoles: Record<ThemeMode, Roles> = {
  light: { base: 500, hover: 600, active: 700, soft: 100, text: 900 },
  dark: { base: 600, hover: 700, active: 500, soft: 100, text: 800 },
}

const roles: Record<ThemeMode, Record<ColorName, Roles>> = {
  light: {
    primary: { base: 600, hover: 500, active: 700, soft: 100, text: 900 },
    secondary: { base: 700, hover: 800, active: 900, soft: 100, text: 900 },
    neutral: { base: 500, hover: 600, active: 700, soft: 100, text: 900 },
    success: statusRoles.light,
    error: statusRoles.light,
    warning: statusRoles.light,
  },
  dark: {
    primary: { base: 600, hover: 700, active: 500, soft: 100, text: 800 },
    secondary: { base: 700, hover: 800, active: 600, soft: 200, text: 900 },
    neutral: { base: 600, hover: 700, active: 500, soft: 200, text: 900 },
    success: statusRoles.dark,
    error: statusRoles.dark,
    warning: statusRoles.dark,
  },
}

/* ================= 3. BUILD ================= */

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

const buildColors = (mode: ThemeMode) => {
  const make = (name: ColorName) => {
    const scale = scales[mode][name]
    const r = roles[mode][name]
    return {
      ...scale,
      base: scale[r.base],
      hover: scale[r.hover],
      active: scale[r.active],
      soft: scale[r.soft],
      text: scale[r.text],
      rgb: hexToRgb(scale[r.base]),
    }
  }
  return {
    primary: make('primary'),
    secondary: make('secondary'),
    neutral: make('neutral'),
    success: make('success'),
    error: make('error'),
    warning: make('warning'),
  }
}

/* Dùng chung cho cả 2 mode */
export const radius = { sm: 4, md: 8, lg: 12 }
export const transition = { fast: '0.2s ease', base: '0.3s ease' }

const buildTokens = (mode: ThemeMode) => {
  const isDark = mode === 'dark'
  const pick = <T>(light: T, dark: T): T => (isDark ? dark : light)

  const colors = buildColors(mode)
  const { primary, secondary } = colors

  return {
    mode,
    colors,

    text: {
      primary: secondary[900],
      secondary: secondary[600],
      disabled: secondary[400],
      inverse: pick('#FFFFFF', secondary[50]),
      brand: pick(primary[900], secondary[900]), // màu chữ nền của app
      accent: pick(primary.base, primary[800]), // chữ nhấn (input, button viền)
      placeholder: pick(primary[300], secondary[500]),
      onPrimary: pick(primary[900], secondary[50]), // chữ trên nền primary
    },

    background: {
      base: pick('#FFFFFF', secondary[100]),
      layout: pick('#fffbf5', secondary[50]),
      elevated: pick('#FFFFFF', '#2F1A10'),
      input: pick('#FAF6F2', secondary[200]),
      spotlight: `rgba(${primary.rgb}, ${pick(0.08, 0.16)})`,
    },

    border: {
      base: pick('#EFD7CC', secondary[300]),
      light: pick('#F5E6DF', secondary[200]),
      focus: pick(primary.base, primary.hover),
    },

    state: {
      selected: pick('#FCE8DF', '#4A2315'),
      hover: pick('#FAF1EC', secondary[200]),
      click: pick('#F6DED3', '#5A2E1C'),
    },

    shadow: {
      primary: `0 4px 12px rgba(${primary.rgb}, ${pick(0.2, 0.3)})`,
      elevated: pick(
        '0 4px 16px rgba(0, 0, 0, 0.08)',
        '0 4px 16px rgba(0, 0, 0, 0.5)',
      ),
      button: pick(
        '0px 2px 0px rgba(0, 0, 0, 0.04)',
        '0px 2px 0px rgba(0, 0, 0, 0.3)',
      ),
    },

    radius,
    transition,
  }
}

export type DesignTokens = ReturnType<typeof buildTokens>

/* Tính 1 lần, dùng lại */
const tokens: Record<ThemeMode, DesignTokens> = {
  light: buildTokens('light'),
  dark: buildTokens('dark'),
}

export const getTokens = (mode: ThemeMode): DesignTokens => tokens[mode]

export const withAlpha = (color: string, alpha: number = 0.15) =>
  `color-mix(in srgb, ${color} ${alpha * 100}%, transparent)`

/* ================= Tương thích code cũ ================= */
/* Lưu ý: colors.primary.light / .dark cũ đã đổi thành .soft / .text */

export const colors = tokens.light.colors
export const textColors = tokens.light.text
export const background = tokens.light.background
export const border = tokens.light.border
export const state = tokens.light.state
export const shadow = tokens.light.shadow

export const colorsDark = tokens.dark.colors
export const textColorsDark = tokens.dark.text
export const backgroundDark = tokens.dark.background
export const borderDark = tokens.dark.border
export const stateDark = tokens.dark.state
export const shadowDark = tokens.dark.shadow
