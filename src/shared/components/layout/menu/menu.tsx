import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Flex, Grid, Input, Typography } from 'antd'
import {
  CalendarSync,
  GoalIcon,
  HandCoins,
  LayoutDashboardIcon,
} from 'lucide-react'
import type { LinkProps } from '@tanstack/react-router'
import { Brand } from '@/shared/assets/images'
import {
  IconArrowTopDown,
  IconCategory,
  IconCreditCard,
  IconSetting,
} from '@/shared/assets/icons'
import { background, colors } from '@/shared/common/design-token'
import './menu.css'

const { useBreakpoint } = Grid

export interface MenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  link?: LinkProps['to']
  children?: Array<MenuItem>
}

export const menus: Array<MenuItem> = [
  {
    id: 'finance',
    label: 'Finance',
    icon: <IconArrowTopDown style={{ fontSize: 18 }} />,
    children: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboardIcon style={{ fontSize: 16 }} />,
        link: '/financial/dashboard',
      },
      {
        id: 'transaction',
        label: 'Transaction',
        icon: <IconArrowTopDown style={{ fontSize: 16 }} />,
        link: '/financial/transaction',
      },
      {
        id: 'category',
        label: 'Category',
        icon: <IconCategory style={{ fontSize: 16 }} />,
        link: '/financial/category',
      },
      {
        id: 'wallet',
        label: 'Wallet',
        icon: <IconCreditCard style={{ fontSize: 16 }} />,
        link: '/financial/wallet',
      },
      {
        id: 'debt',
        label: 'Debt',
        icon: <HandCoins size={16} />,
        link: '/financial/debt',
      },
      {
        id: 'goal',
        label: 'Goal',
        icon: <GoalIcon size={16} />,
        link: '/financial/goal',
      },
      {
        id: 'recurring',
        label: 'Recurring',
        icon: <CalendarSync size={16} />,
        link: '/financial/recurring',
      },
      {
        id: 'setting',
        label: 'Settings',
        icon: <IconSetting style={{ fontSize: 16 }} />,
        link: '/financial/setting',
      },
    ],
  },
]

// Animation cho Container Popover
const menuVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
}

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false)
  // 1. Luôn un-expand (mặc định null) khi bắt đầu
  const [activeSubmenuId, setActiveSubmenuId] = useState<string | null>(null)

  const screen = useBreakpoint()
  const isMobile = !screen.md // Xác định xem có phải màn hình nhỏ hay không
  const navigate = useNavigate()
  const location = useLocation()

  const handleClose = () => {
    setIsOpen(false)
    setActiveSubmenuId(null) // Reset submenu state khi đóng
  }

  const handleMenuClick = (menu: MenuItem) => {
    if (menu.children && menu.children.length > 0) {
      setActiveSubmenuId(activeSubmenuId === menu.id ? null : menu.id)
      return
    }

    if (menu.link) {
      navigate({ to: menu.link })
      handleClose()
    }
  }

  return (
    <>
      {/* 2. OVERLAY WRAPPER LÀM TỐI MÀN HÌNH */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 998,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(3px)',
            }}
          />
        )}
      </AnimatePresence>

      <Flex
        style={{
          width: '100%',
          background: '#3D1F10',
          padding: 12,
          zIndex: 999,
          ...(!isMobile && {
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
          }),
        }}
        justify="space-between"
        align="center"
      >
        {/* Left: Logo & Dropdown Trigger */}
        <Flex align="center" gap={12} style={{ position: 'relative' }}>
          <motion.img
            src={Brand}
            alt="Brand"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (isOpen) {
                handleClose()
              } else {
                setIsOpen(true)
                setActiveSubmenuId(null) // Đảm bảo luôn un-expand khi mở lại
              }
            }}
            style={{
              width: 40,
              height: 40,
              background: '#B74C36',
              borderRadius: 8,
              cursor: 'pointer',
              boxShadow: isOpen ? '0 0 0 2px #B74C36' : 'none',
              transition: 'box-shadow 0.2s ease',
            }}
          />
          {screen.md && (
            <Typography className="sidebar-title">Blossom</Typography>
          )}

          {/* POPOVER MENU CHÍNH (CAP 1: Finance) */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  left: 0,
                  backgroundColor: background.base,
                  borderRadius: 12,
                  padding: '8px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
                  border: `1px solid ${colors.primary.base}30`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  minWidth: 180,
                  zIndex: 1000,
                }}
              >
                {menus.map((menu) => {
                  const hasChildren = Boolean(menu.children?.length)
                  const isSubOpen = activeSubmenuId === menu.id

                  const isParentSelected = menu.children?.some(
                    (child) =>
                      child.link && location.pathname.startsWith(child.link),
                  )

                  return (
                    <div
                      key={menu.id}
                      style={{ position: 'relative' }}
                      onMouseEnter={() =>
                        hasChildren && setActiveSubmenuId(menu.id)
                      }
                    >
                      {/* Menu Cấp 1 */}
                      <motion.div
                        variants={itemVariants}
                        onClick={() => handleMenuClick(menu)}
                        whileHover={{ x: 4 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          backgroundColor:
                            isParentSelected || isSubOpen
                              ? `${colors.primary.base}15`
                              : 'transparent',
                          color: colors.primary.base,
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <Flex align="center" gap={10}>
                          {menu.icon && (
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: 18,
                              }}
                            >
                              {menu.icon}
                            </span>
                          )}
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: isParentSelected ? 600 : 500,
                            }}
                          >
                            {menu.label}
                          </span>
                        </Flex>
                        {/* 3. Đã bỏ Icon xổ (▶) tại đây */}
                      </motion.div>

                      {/* SUBMENU CẤP 2 */}
                      <AnimatePresence>
                        {hasChildren && isSubOpen && (
                          <motion.div
                            initial={{ opacity: 0, x: -8, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 'calc(100% + 8px)',
                              backgroundColor: background.base,
                              borderRadius: 12,
                              padding: '8px',
                              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
                              border: `1px solid ${colors.primary.base}30`,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 4,
                              minWidth: 180,
                              zIndex: 1001,
                            }}
                          >
                            {menu.children?.map((child) => {
                              const isChildSelected =
                                child.link &&
                                location.pathname.startsWith(child.link)

                              return (
                                <motion.div
                                  key={child.id}
                                  onClick={() => handleMenuClick(child)}
                                  whileHover={{ x: 4 }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    cursor: 'pointer',
                                    backgroundColor: isChildSelected
                                      ? colors.primary.base
                                      : 'transparent',
                                    color: isChildSelected
                                      ? '#ffffff'
                                      : colors.primary.base,
                                    transition: 'background-color 0.2s ease',
                                  }}
                                >
                                  {child.icon && (
                                    <span
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: 16,
                                      }}
                                    >
                                      {child.icon}
                                    </span>
                                  )}
                                  <span
                                    style={{
                                      fontSize: 13,
                                      fontWeight: isChildSelected ? 600 : 500,
                                    }}
                                  >
                                    {child.label}
                                  </span>
                                </motion.div>
                              )
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </Flex>

        {/* Right */}
        {screen.md && (
          <Flex gap={8}>
            <Input placeholder="Search..." style={{ width: 200 }} />
            <img
              src={Brand}
              alt="Brand"
              style={{
                width: 30,
                height: 30,
                background: '#B74C36',
                borderRadius: 999,
              }}
            />
          </Flex>
        )}
      </Flex>
    </>
  )
}
