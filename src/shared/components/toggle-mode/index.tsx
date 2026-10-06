import { Button } from 'antd'
import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

export const ToggleThemeMode = () => {
  const { mode, toggle } = useThemeMode()
  const { colors } = getTokens(mode)
  const isDark = mode === 'dark'

  return (
    <Button
      type="text"
      shape="circle"
      onClick={toggle}
      aria-label="Toggle theme mode"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
      icon={
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDark ? 'dark' : 'light'}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isDark ? (
              <Moon
                style={{
                  width: 20,
                  height: 20,
                  color: colors.primary.active,
                }}
              />
            ) : (
              <Sun
                style={{
                  width: 20,
                  height: 20,
                  color: colors.primary.base,
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      }
    />
  )
}
