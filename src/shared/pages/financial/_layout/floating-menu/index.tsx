import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Grid } from 'antd' // 1. Import Grid từ antd
import { GoalIcon } from 'lucide-react'
import type { Variants } from 'motion/react'
import type { LinkProps } from '@tanstack/react-router'
import {
  IconArrowTopDown,
  IconCategory,
  IconCreditCard,
  IconSetting,
} from '@/shared/assets/icons'
import { background, colors } from '@/shared/common/design-token'

const { useBreakpoint } = Grid // 2. Lấy hook useBreakpoint

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  link: LinkProps['to']
}

const menus: Array<MenuItem> = [
  {
    id: 'transaction',
    label: 'Transaction',
    icon: <IconArrowTopDown style={{ fontSize: 20 }} />,
    link: '/financial/transaction',
  },
  {
    id: 'category',
    label: 'Category',
    icon: <IconCategory style={{ fontSize: 20 }} />,
    link: '/financial/category',
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: <IconCreditCard style={{ fontSize: 20 }} />,
    link: '/financial/wallet',
  },
  {
    id: 'goal',
    label: 'Goal',
    icon: <GoalIcon size={16} />,
    link: '/financial/goal',
  },
  {
    id: 'setting',
    label: 'Settings',
    icon: <IconSetting style={{ fontSize: 20 }} />,
    link: '/financial/setting',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
  exit: { opacity: 0, y: 10, scale: 0.8, transition: { duration: 0.15 } },
}

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // 3. Kiểm tra kích thước màn hình
  const screen = useBreakpoint()

  // 4. Nếu là mobile (xs), không hiển thị Floating Menu
  if (screen.xs) {
    return null
  }

  const handleMenuClick = (e: React.MouseEvent, menu: MenuItem) => {
    e.stopPropagation()
    setIsOpen(false)
    if (menu.link) {
      navigate({ to: menu.link })
    }
  }

  return (
    <>
      {/* 1. OVERLAY LAYER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9998,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(3px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* 2. FLOATING MENU CONTAINER */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
      >
        {/* SUB-MENU ITEMS LIST */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 12,
                marginBottom: 12,
              }}
            >
              {menus.map((menu) => {
                const isSelected = location.pathname.startsWith(menu.link || '')

                return (
                  <motion.div
                    key={menu.id}
                    variants={itemVariants}
                    onClick={(e) => handleMenuClick(e, menu)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      cursor: 'pointer',
                    }}
                  >
                    {/* Label tên Menu */}
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? '#ffffff' : colors.primary.base,
                        backgroundColor: isSelected
                          ? colors.primary.base
                          : background.base,
                        padding: '4px 10px',
                        borderRadius: 6,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        border: `1px solid ${colors.primary.base}${isSelected ? 'FF' : '30'}`,
                        userSelect: 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {menu.label}
                    </span>

                    {/* Icon Button */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isSelected
                          ? colors.primary.base
                          : background.base,
                        border: `1.5px solid ${colors.primary.base}`,
                        color: isSelected ? '#ffffff' : colors.primary.base,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {menu.icon}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* NÚT TÁC VỤ CHÍNH (HAMBURGER TO CLOSE) */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary.base,
            color: '#ffffff',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.18)',
            border: 'none',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <motion.line
              x1="4"
              y1="6"
              x2="20"
              y2="6"
              animate={{
                y1: isOpen ? 12 : 6,
                y2: isOpen ? 12 : 6,
                rotate: isOpen ? 45 : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              style={{ transformOrigin: 'center' }}
            />
            <motion.line
              x1="4"
              y1="12"
              x2="20"
              y2="12"
              animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0 : 1 }}
              transition={{ duration: 0.15 }}
            />
            <motion.line
              x1="4"
              y1="18"
              x2="20"
              y2="18"
              animate={{
                y1: isOpen ? 12 : 18,
                y2: isOpen ? 12 : 18,
                rotate: isOpen ? -45 : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              style={{ transformOrigin: 'center' }}
            />
          </svg>
        </motion.div>
      </div>
    </>
  )
}
