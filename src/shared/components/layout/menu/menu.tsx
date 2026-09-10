import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Dropdown, Flex, Grid, Typography } from 'antd'
import { ChevronDown, Ellipsis, MenuIcon, XIcon } from 'lucide-react'
import useApp from 'antd/es/app/useApp'
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

import type { AppMenuItem } from '@/shared/common/menu'
import { Brand } from '@/shared/assets/images'

import { background, colors } from '@/shared/common/design-token'
import './menu.css'
import { useAuthStore } from '@/shared/auth/auth.store'
import { useMutationAuth } from '@/shared/api/auth/auth.mutation'
import { LogoutService } from '@/shared/auth/logout.service'
import { AppMenu } from '@/shared/common/menu'

const { useBreakpoint } = Grid

const MORE_MENU_ID = '__more__'
const NAV_GAP = 4
const MORE_BTN_WIDTH = 88 // chiều rộng dự phòng cho nút "Thêm"

// Animation cho dropdown xổ xuống từ thanh ngang
const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, staggerChildren: 0.03 },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    transition: { duration: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0 },
}

export default function Menu() {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null)

  // Số mục cấp 1 hiển thị trực tiếp; phần còn lại gom vào nút "Thêm"
  const [visibleCount, setVisibleCount] = useState(AppMenu.length)

  const navRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const screen = useBreakpoint()
  const isMobile = !screen.md
  const navigate = useNavigate()
  const location = useLocation()

  const { message } = useApp()
  const { user } = useAuthStore()
  const [open, setOpen] = useState(false)

  const { mLogout } = useMutationAuth()

  // ===== ĐO CHIỀU RỘNG & TÍNH SỐ MỤC HIỂN THỊ =====
  useLayoutEffect(() => {
    if (isMobile) return
    const nav = navRef.current
    const measure = measureRef.current
    if (!nav || !measure) return

    const compute = () => {
      const available = nav.offsetWidth
      const widths = Array.from(measure.children).map(
        (el) => (el as HTMLElement).offsetWidth,
      )
      const total = widths.length

      const fits = (count: number) => {
        let w =
          widths.slice(0, count).reduce((a, b) => a + b, 0) +
          Math.max(0, count - 1) * NAV_GAP
        // Nếu còn mục bị ẩn thì phải chừa chỗ cho nút "Thêm"
        if (count < total) w += MORE_BTN_WIDTH + (count > 0 ? NAV_GAP : 0)
        return w <= available
      }

      let count = total
      while (count > 0 && !fits(count)) count--
      setVisibleCount(count)
    }

    compute()
    const observer = new ResizeObserver(compute)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [isMobile])

  const visibleMenus = AppMenu.slice(0, visibleCount)
  const hiddenMenus = AppMenu.slice(visibleCount)

  const handleLogout = () => {
    mLogout.mutate(
      {},
      {
        onSuccess: () => {
          LogoutService.logout()
          message.success('Đăng xuất thành công')
        },
      },
    )
  }

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Đổi mật khẩu',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: 'Đăng xuất',
      onClick: () => {
        handleLogout()
      },
    },
  ]

  const openMenu = (id: string) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setActiveMenuId(id)
  }

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setActiveMenuId(null), 120)
  }

  const handleNavigate = (menu: AppMenuItem) => {
    if (!menu.link) return
    navigate({ to: menu.link })
    setActiveMenuId(null)
    setMobileOpen(false)
    setMobileExpandedId(null)
  }

  const isParentSelected = (menu: AppMenuItem) =>
    menu.children?.some(
      (child) => child.link && location.pathname.startsWith(child.link),
    )

  // Nút "Thêm" được đánh dấu selected nếu route hiện tại thuộc menu bị ẩn
  const isMoreSelected = hiddenMenus.some(
    (m) =>
      isParentSelected(m) || (m.link && location.pathname.startsWith(m.link)),
  )

  // ===== SUB-COMPONENT: nút menu cấp 1 (dùng chung cho hàng thật & hàng đo) =====
  const TopLevelButton = ({
    menu,
    selected,
    opened,
    withChevron,
  }: {
    menu: AppMenuItem
    selected?: boolean
    opened?: boolean
    withChevron?: boolean
  }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        borderRadius: 8,
        cursor: 'pointer',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        color: '#ffffff',
        backgroundColor:
          selected || opened ? 'rgba(183, 76, 54, 0.35)' : 'transparent',
        transition: 'background-color 0.2s ease',
      }}
    >
      {menu.icon && (
        <span style={{ display: 'flex', alignItems: 'center', fontSize: 18 }}>
          {menu.icon}
        </span>
      )}
      <span style={{ fontSize: 14, fontWeight: selected ? 600 : 500 }}>
        {menu.label}
      </span>
      {withChevron && (
        <motion.span
          animate={{ rotate: opened ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <ChevronDown size={14} />
        </motion.span>
      )}
    </div>
  )

  // ===== SUB-COMPONENT: item cấp 2 trong dropdown =====
  const ChildItem = ({ child }: { child: AppMenuItem }) => {
    const isChildSelected =
      child.link && location.pathname.startsWith(child.link)

    return (
      <motion.div
        variants={itemVariants}
        onClick={() => handleNavigate(child)}
        whileHover={{ x: 4 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 12px',
          borderRadius: 8,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          backgroundColor: isChildSelected
            ? colors.primary.base
            : 'transparent',
          color: isChildSelected ? '#ffffff' : colors.primary.base,
          transition: 'background-color 0.2s ease',
        }}
      >
        {child.icon && (
          <span style={{ display: 'flex', alignItems: 'center', fontSize: 16 }}>
            {child.icon}
          </span>
        )}
        <span style={{ fontSize: 13, fontWeight: isChildSelected ? 600 : 500 }}>
          {child.label}
        </span>
      </motion.div>
    )
  }

  const dropdownPanelStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    backgroundColor: background.base,
    borderRadius: 12,
    padding: '8px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
    border: `1px solid ${colors.primary.base}30`,
    zIndex: 1000,
  }

  return (
    <>
      {/* Overlay làm tối màn hình khi mobile panel mở */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setMobileOpen(false)
              setMobileExpandedId(null)
            }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 998,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(3px)',
            }}
          />
        )}
      </AnimatePresence>

      <Flex
        vertical
        style={{
          width: '100%',
          background: '#3D1F10',
          zIndex: 999,
          ...(!isMobile && {
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
          }),
        }}
        onMouseLeave={() => !isMobile && scheduleClose()}
      >
        <Flex
          style={{ width: '100%', padding: 12 }}
          justify="space-between"
          align="center"
          gap={16}
        >
          {/* Left: Logo + Brand */}
          <Flex align="center" gap={12} style={{ flexShrink: 0 }}>
            <motion.img
              src={Brand}
              alt="Brand"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate({ to: '/' })
                setActiveMenuId(null)
              }}
              style={{
                width: 40,
                height: 40,
                background: '#B74C36',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            />
            {screen.md && (
              <Typography className="sidebar-title">Blossom</Typography>
            )}
          </Flex>

          {/* Middle: MENU NGANG + overflow "Thêm" (desktop) */}
          {!isMobile && (
            <div
              ref={navRef}
              style={{
                flex: 1,
                minWidth: 0, // cho phép flex item co lại để đo đúng
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: NAV_GAP,
              }}
            >
              {/* HÀNG ĐO ẨN: bản sao của toàn bộ mục cấp 1, chỉ để đo chiều rộng */}
              <div
                ref={measureRef}
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  visibility: 'hidden',
                  pointerEvents: 'none',
                  display: 'flex',
                  gap: NAV_GAP,
                }}
              >
                {AppMenu.map((menu) => (
                  <TopLevelButton
                    key={menu.id}
                    menu={menu}
                    withChevron={Boolean(menu.children?.length)}
                  />
                ))}
              </div>

              {/* Các mục hiển thị trực tiếp */}
              {visibleMenus.map((menu) => {
                const hasChildren = Boolean(menu.children?.length)
                const isDropOpen = activeMenuId === menu.id
                const selected = isParentSelected(menu)

                return (
                  <div
                    key={menu.id}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => hasChildren && openMenu(menu.id)}
                  >
                    <div
                      onClick={() => {
                        if (hasChildren) {
                          setActiveMenuId(isDropOpen ? null : menu.id)
                        } else {
                          handleNavigate(menu)
                        }
                      }}
                    >
                      <TopLevelButton
                        menu={menu}
                        selected={selected}
                        opened={isDropOpen}
                        withChevron={hasChildren}
                      />
                    </div>

                    <AnimatePresence>
                      {hasChildren && isDropOpen && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          onMouseEnter={() => openMenu(menu.id)}
                          style={{
                            ...dropdownPanelStyle,
                            left: 0,
                            display: 'grid',
                            gridTemplateColumns:
                              (menu.children?.length ?? 0) > 5
                                ? 'repeat(2, minmax(160px, 1fr))'
                                : 'minmax(180px, 1fr)',
                            gap: 4,
                          }}
                        >
                          {menu.children?.map((child) => (
                            <ChildItem key={child.id} child={child} />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}

              {/* NÚT "THÊM" chứa các mục bị tràn */}
              {hiddenMenus.length > 0 && (
                <div
                  style={{ position: 'relative' }}
                  onMouseEnter={() => openMenu(MORE_MENU_ID)}
                >
                  <div
                    onClick={() =>
                      setActiveMenuId(
                        activeMenuId === MORE_MENU_ID ? null : MORE_MENU_ID,
                      )
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 14px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      color: '#ffffff',
                      backgroundColor:
                        isMoreSelected || activeMenuId === MORE_MENU_ID
                          ? 'rgba(183, 76, 54, 0.35)'
                          : 'transparent',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <Ellipsis size={18} />
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: isMoreSelected ? 600 : 500,
                      }}
                    >
                      Thêm
                    </span>
                  </div>

                  <AnimatePresence>
                    {activeMenuId === MORE_MENU_ID && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onMouseEnter={() => openMenu(MORE_MENU_ID)}
                        style={{
                          ...dropdownPanelStyle,
                          right: 0, // neo phải để không tràn ra ngoài màn hình
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4,
                          minWidth: 200,
                          maxHeight: 'calc(100vh - 120px)',
                          overflowY: 'auto',
                        }}
                      >
                        {hiddenMenus.map((menu) => (
                          <div key={menu.id}>
                            {menu.children?.length ? (
                              <>
                                {/* Tên nhóm */}
                                <Flex
                                  align="center"
                                  gap={8}
                                  style={{
                                    padding: '8px 12px 4px',
                                    color: `${colors.primary.base}99`,
                                    fontSize: 12,
                                    fontWeight: 600,
                                  }}
                                >
                                  {menu.icon}
                                  {menu.label}
                                </Flex>
                                {menu.children.map((child) => (
                                  <ChildItem key={child.id} child={child} />
                                ))}
                              </>
                            ) : (
                              <ChildItem child={menu} />
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {/* Right Section */}
          {screen.md ? (
            <Flex align="center" gap={12} style={{ flexShrink: 0 }}>
              <Dropdown
                menu={{ items }}
                trigger={['click']}
                placement="bottomRight"
                open={open}
                onOpenChange={setOpen}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    padding: '4px 8px 4px 4px',
                    borderRadius: 20,
                    backgroundColor: open
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'transparent',
                    border: `1px solid ${open ? '#B74C36' : 'transparent'}`,
                    transition:
                      'background-color 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      padding: 2,
                      background: open
                        ? 'linear-gradient(135deg, #B74C36, #B74C36)'
                        : 'transparent',
                    }}
                  >
                    <img
                      src={Brand}
                      alt={'User Avatar'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        background: '#B74C36',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      }}
                    />
                  </div>

                  <Flex vertical style={{ userSelect: 'none' }}>
                    <Typography.Text
                      style={{
                        color: '#ffffff',
                        fontSize: 13,
                        fontWeight: 600,
                        lineHeight: 1.2,
                      }}
                    >
                      {'Tài khoản'}
                    </Typography.Text>
                    <Typography.Text
                      style={{
                        color: 'rgba(255, 255, 255, 0.65)',
                        fontSize: 11,
                        lineHeight: 1.2,
                      }}
                    >
                      {'Thành viên'}
                    </Typography.Text>
                  </Flex>
                </motion.div>
              </Dropdown>
            </Flex>
          ) : (
            <motion.div
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                setMobileOpen((prev) => !prev)
                setMobileExpandedId(null)
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
                backgroundColor: mobileOpen
                  ? 'rgba(183, 76, 54, 0.35)'
                  : 'transparent',
                transition: 'background-color 0.2s ease',
              }}
            >
              {mobileOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
            </motion.div>
          )}
        </Flex>

        {/* MOBILE PANEL: accordion xổ xuống toàn chiều ngang */}
        <AnimatePresence>
          {isMobile && mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: 'hidden', zIndex: 999 }}
            >
              <Flex
                vertical
                gap={4}
                style={{
                  padding: '4px 12px 12px',
                  backgroundColor: background.base,
                  borderTop: `1px solid ${colors.primary.base}30`,
                  // Menu dài trên mobile thì scroll dọc trong panel
                  maxHeight: 'calc(100vh - 80px)',
                  overflowY: 'auto',
                }}
              >
                {AppMenu.map((menu) => {
                  const hasChildren = Boolean(menu.children?.length)
                  const expanded = mobileExpandedId === menu.id
                  const selected = isParentSelected(menu)

                  return (
                    <div key={menu.id}>
                      <div
                        onClick={() => {
                          if (hasChildren) {
                            setMobileExpandedId(expanded ? null : menu.id)
                          } else {
                            handleNavigate(menu)
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          color: colors.primary.base,
                          backgroundColor:
                            selected || expanded
                              ? `${colors.primary.base}15`
                              : 'transparent',
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <Flex align="center" gap={10}>
                          {menu.icon}
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: selected ? 600 : 500,
                            }}
                          >
                            {menu.label}
                          </span>
                        </Flex>
                        {hasChildren && (
                          <motion.span
                            animate={{ rotate: expanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <ChevronDown size={16} />
                          </motion.span>
                        )}
                      </div>

                      <AnimatePresence>
                        {hasChildren && expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <Flex
                              vertical
                              gap={2}
                              style={{ padding: '4px 0 4px 24px' }}
                            >
                              {menu.children?.map((child) => (
                                <ChildItem key={child.id} child={child} />
                              ))}
                            </Flex>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </Flex>
            </motion.div>
          )}
        </AnimatePresence>
      </Flex>
    </>
  )
}
