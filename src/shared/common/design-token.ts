/* =====================================================
 * COLOR SYSTEM — LIGHT MODE
 * ===================================================== */

export const colors = {
  /* ================= PRIMARY ================= */
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

    base: '#E45A2B',
    hover: '#F27A4E',
    active: '#C9471C',
    light: '#FFF5F0',
    dark: '#7A2A12',
    rgb: '228, 90, 43',
  },

  /* ================= SECONDARY ================= */
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

    base: '#4B2415',
    hover: '#34180E',
    active: '#2F1A10',
    light: '#F8F4F1',
    dark: '#2F1A10',
    rgb: '75, 36, 21',
  },

  /* ================= SUCCESS ================= */
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

    base: '#22C55E',
    hover: '#16A34A',
    active: '#15803D',
    light: '#DCFCE7',
    dark: '#14532D',
    rgb: '34, 197, 94',
  },

  /* ================= ERROR ================= */
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

    base: '#EF4444',
    hover: '#DC2626',
    active: '#B91C1C',
    light: '#FEE2E2',
    dark: '#7F1D1D',
    rgb: '239, 68, 68',
  },

  /* ================= WARNING ================= */
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

    base: '#F59E0B',
    hover: '#D97706',
    active: '#B45309',
    light: '#FEF3C7',
    dark: '#78350F',
    rgb: '245, 158, 11',
  },
}

/* ================= TEXT ================= */

export const textColors = {
  primary: colors.secondary[900],
  secondary: colors.secondary[600],
  disabled: colors.secondary[400],
  inverse: '#FFFFFF',
}

/* ================= BACKGROUND ================= */

export const background = {
  base: '#FFFFFF',
  layout: '#fffbf5',
  elevated: '#FFFFFF',
  spotlight: `rgba(${colors.primary.rgb}, 0.08)`,
}

/* ================= BORDER ================= */

export const border = {
  base: '#EFD7CC',
  light: '#F5E6DF',
  focus: colors.primary.base,
}

/* ================= STATE ================= */

export const state = {
  selected: '#FCE8DF',
  hover: '#FAF1EC',
  click: '#F6DED3',
}

/* ================= SHADOW ================= */

export const shadow = {
  primary: `0 4px 12px rgba(${colors.primary.rgb}, 0.2)`,
}

/* ================= RADIUS ================= */

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
}

/* ================= TRANSITION ================= */

export const transition = {
  fast: '0.2s ease',
  base: '0.3s ease',
}
