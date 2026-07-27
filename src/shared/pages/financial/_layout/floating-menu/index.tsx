import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from '@tanstack/react-router'
import type { Variants } from 'motion/react'
import type { LinkProps } from '@tanstack/react-router'
import {
  IconArrowTopDown,
  IconCategory,
  IconCreditCard,
  IconSetting,
} from '@/shared/assets/icons'
import { background, colors } from '@/shared/common/design-token'

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  link?: LinkProps['to']
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
    id: 'setting',
    label: 'Settings',
    icon: <IconSetting style={{ fontSize: 20 }} />,
    link: '/financial/setting',
  },
]

// Variants cho container sub-menu
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

// Variants cho từng menu item
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
  const [selectedMenu, setSelectedMenu] = useState<MenuItem>(menus[0])
  const navigate = useNavigate()

  const handleMenuClick = (e: React.MouseEvent, menu: MenuItem) => {
    e.stopPropagation()
    setSelectedMenu(menu)
    setIsOpen(false)
    if (menu.link) navigate({ to: menu.link })
  }

  return (
    <>
      {/* 1. OVERLAY LAYER (Làm mờ nền & Chống click nhầm) */}
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
                const isSelected = selectedMenu.id === menu.id

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
                    {/* Label tên Menu hiển thị bên trái */}
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: colors.primary.base,
                        backgroundColor: background.base,
                        padding: '4px 10px',
                        borderRadius: 6,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        border: `1px solid ${colors.primary.base}30`,
                        userSelect: 'none',
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
                          ? `${colors.primary.base}15`
                          : background.base,
                        border: `1.5px solid ${colors.primary.base}`,
                        color: colors.primary.base,
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

        {/* NÚT TÁC VỤ CHÍNH (MAIN TRIGGER BUTTON) */}
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
          {/* Icon Dấu cộng xoay 135 độ chuyển thành Dấu X khi mở */}
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </motion.svg>
        </motion.div>
      </div>
    </>
  )
}
