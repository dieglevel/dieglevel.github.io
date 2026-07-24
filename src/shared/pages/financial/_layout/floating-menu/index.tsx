import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Tooltip } from 'antd'
import { useNavigate } from '@tanstack/react-router'
import styles from './index.module.css'
import type { LinkProps } from '@tanstack/react-router'
import {
  IconCategory,
  IconCreditCard,
  IconSetting,
} from '@/shared/assets/icons'
import { background, colors } from '@/shared/common/design-token'

interface MenuItem {
  label: string
  icon: React.ReactNode
  link?: LinkProps['to']
}

const menus: Array<MenuItem> = [
  {
    label: 'Transaction',
    icon: (
      <IconCategory style={{ fontSize: 'auto', color: colors.primary.base }} />
    ),
    link: '/financial/transaction',
  },
  {
    label: 'Category',
    icon: (
      <IconCategory style={{ fontSize: 'auto', color: colors.primary.base }} />
    ),
    link: '/financial/category',
  },
  {
    label: 'Wallet',
    icon: (
      <IconCreditCard
        style={{ fontSize: 'auto', color: colors.primary.base }}
      />
    ),
    link: '/financial/wallet',
  },
  {
    label: 'Settings',
    icon: (
      <IconSetting style={{ fontSize: 'auto', color: colors.primary.base }} />
    ),
    link: '/financial/setting',
  },
]

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState<MenuItem>(menus[0])
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const handleMenuClick = (menu: MenuItem) => {
    setSelectedMenu(menu)
    setIsOpen(false)
    menu.link && navigate({ to: menu.link })
  }

  // Close the menu when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  // Add event listener for clicks outside the menu
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div
        className={styles.mainButton}
        style={{
          border: '1px solid var(--primary-base)',
          width: 40,
          height: 40,
          borderRadius: 8,
          padding: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: background.base,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selectedMenu.label}
            initial={{
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              opacity: 1,
              rotate: 360,
            }}
            exit={{
              opacity: 0,
              rotate: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
            }}
          >
            {selectedMenu.icon}
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.div
        initial={{ height: 0 }}
        animate={{
          height: isOpen ? 'auto' : 0,
        }}
        style={{
          overflow: 'hidden',
          position: 'absolute',
          bottom: 50,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {menus.map((menu, index) => (
          <div
            key={index}
            onClick={() => handleMenuClick(menu)}
            style={{
              padding: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              fontSize: 26,
              backgroundColor: background.base,
              border: `1px solid ${colors.primary.base}`,
            }}
            className={styles.button}
          >
            <Tooltip placement="left" title={menu.label} mouseEnterDelay={1}>
              {menu.icon}
            </Tooltip>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
