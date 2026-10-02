import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ConfigProvider } from 'antd'
import { getConfigAntd } from '../common/antd-config-provider.constant'
import {
  LOCAL_STORAGE_KEY,
  LocalStorageService,
} from '../lib/service/local-storage'
import type { ThemeMode } from '../common/antd-config-provider.constant'

/* ============ Context ============ */

type ThemeContextValue = {
  mode: ThemeMode
  isDark: boolean
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const isThemeMode = (value: unknown): value is ThemeMode =>
  value === 'light' || value === 'dark'

/* Ưu tiên: lựa chọn đã lưu -> theo hệ điều hành -> light */
const getInitialMode = (): ThemeMode => {
  try {
    const saved = LocalStorageService.get<ThemeMode>(LOCAL_STORAGE_KEY.THEME)
    if (isThemeMode(saved)) return saved
  } catch {
    /* localStorage có thể bị chặn (private mode, SSR...) */
  }
  if (
    typeof window !== 'undefined' &&
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark'
  }
  return 'light'
}

/* ============ Provider ============ */

export const AppThemeProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode)

  /* Đồng bộ ra <html> để CSS / Tailwind ngoài antd cũng nhận biết mode */
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', mode)
    root.style.colorScheme = mode
    try {
      LocalStorageService.set(LOCAL_STORAGE_KEY.THEME, mode)
    } catch {
      /* ignore */
    }
  }, [mode])

  const toggle = useCallback(() => {
    setMode((m) => (m === 'dark' ? 'light' : 'dark'))
  }, [])

  const configAntd = useMemo(() => getConfigAntd(mode), [mode])

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, isDark: mode === 'dark', setMode, toggle }),
    [mode, toggle],
  )

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider {...configAntd}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  )
}

/* ============ Hook ============ */

export const useThemeMode = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx)
    throw new Error('useThemeMode must be used inside <AppThemeProvider>')
  return ctx
}
