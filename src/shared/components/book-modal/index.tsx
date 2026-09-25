import { useEffect, useState } from 'react'
import { Modal, Tooltip } from 'antd'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronRight, Lightbulb, X } from 'lucide-react'
import { DEFAULT_SECTIONS } from './mock'
import type { FC } from 'react'
import type { BookSection } from './type'

type Breakpoint = 'mobile' | 'tablet' | 'desktop'

const getBreakpoint = (width: number): Breakpoint => {
  if (width < 640) return 'mobile'
  if (width < 900) return 'tablet'
  return 'desktop'
}

const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() =>
    typeof window !== 'undefined'
      ? getBreakpoint(window.innerWidth)
      : 'desktop',
  )

  useEffect(() => {
    const handleResize = () => setBreakpoint(getBreakpoint(window.innerWidth))
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}

interface GuideBookModalProps {
  title?: string
  sections?: Array<BookSection>
  open?: boolean
  onClose?: () => void
}

const GuideBookModal: FC<GuideBookModalProps> = ({
  sections = DEFAULT_SECTIONS,
  open,
  onClose,
}) => {
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'mobile'
  const isTablet = breakpoint === 'tablet'
  const isCompact = isMobile || isTablet

  // State quản lý Tab chính đang chọn
  const [activeKey, setActiveKey] = useState<string>(sections[0]?.key ?? '')

  // State quản lý Sub-tab đang chọn
  const [activeSubKey, setActiveSubKey] = useState<string>('')

  const activeIndex = sections.findIndex((s) => s.key === activeKey)
  const activeSection = sections[activeIndex] ?? sections[0]

  // Tự động set sub-tab đầu tiên khi đổi Tab chính
  useEffect(() => {
    if (activeSection.items && activeSection.items.length > 0) {
      setActiveSubKey(activeSection.items[0].key)
    } else {
      setActiveSubKey('')
    }
  }, [activeKey, activeSection])

  // Phím tắt mũi tên ← → chuyển tab (chỉ áp dụng ở màn hình đủ rộng,
  // trên mobile các mũi tên không có ý nghĩa thao tác)
  useEffect(() => {
    if (!open || isMobile) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && activeIndex < sections.length - 1) {
        setActiveKey(sections[activeIndex + 1].key)
      }
      if (e.key === 'ArrowLeft' && activeIndex > 0) {
        setActiveKey(sections[activeIndex - 1].key)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, isMobile, activeIndex, sections])

  // Lấy ra sub-item đang chọn hiện tại
  const currentSubItem = activeSection.items?.find(
    (i) => i.key === activeSubKey,
  )

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width={
          isMobile
            ? '100vw'
            : isTablet
              ? 'min(720px, 94vw)'
              : 'min(1080px, 95vw)'
        }
        destroyOnClose
        closeIcon={null}
        centered={!isMobile}
        style={
          isMobile
            ? { top: 0, maxWidth: '100vw', margin: 0, padding: 0 }
            : undefined
        }
        styles={{
          container: {
            padding: 0,
            borderRadius: isMobile ? 0 : 16,
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            border: isMobile ? 'none' : '1px solid #F0F0F0',
            background: '#FFFFFF',
          },
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
          },
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isCompact ? 'column' : 'row',
            height: isMobile ? '100vh' : 'min(720px, 86vh)',
            background: '#FFFFFF',
          }}
        >
          {/* ==========================================================================
             CỘT 1 / HÀNG 1: TABS CHÍNH
             Desktop & tablet: cột dọc bên trái. Mobile: hàng ngang cuộn được.
             ========================================================================== */}
          <div
            style={
              isCompact
                ? {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    background: '#FAFAFA',
                    borderBottom: '1px solid #F0F0F0',
                    padding: '10px 12px',
                    gap: 8,
                    flexShrink: 0,
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                  }
                : {
                    width: 64,
                    background: '#FAFAFA',
                    borderRight: '1px solid #F0F0F0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px 0',
                    gap: 10,
                    flexShrink: 0,
                  }
            }
          >
            {sections.map((s) => {
              const isActive = s.key === activeKey
              const Icon = s.icon
              const button = (
                <motion.button
                  key={s.key}
                  onClick={() => setActiveKey(s.key)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: isCompact ? 6 : 0,
                    width: isCompact ? 'auto' : 42,
                    height: 42,
                    padding: isCompact ? '0 14px' : 0,
                    borderRadius: 10,
                    border: 'none',
                    background: isActive ? '#1677FF' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#595959',
                    cursor: 'pointer',
                    boxShadow: isActive
                      ? '0 4px 12px rgba(22, 119, 255, 0.28)'
                      : 'none',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon size={19} />
                  {isCompact && (
                    <span
                      style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}
                    >
                      {s.label}
                    </span>
                  )}
                  {isActive && !isCompact && (
                    <motion.div
                      layoutId="activeIndicator"
                      style={{
                        position: 'absolute',
                        left: -11,
                        width: 4,
                        height: 18,
                        borderRadius: '0 4px 4px 0',
                        background: '#1677FF',
                      }}
                    />
                  )}
                </motion.button>
              )

              return isCompact ? (
                <div key={s.key}>{button}</div>
              ) : (
                <Tooltip key={s.key} title={s.label} placement="right">
                  {button}
                </Tooltip>
              )
            })}
          </div>

          {/* ==========================================================================
             CỘT 2 / HÀNG 2: SUB-TABS
             Desktop & tablet: cột dọc. Mobile: hàng chip cuộn ngang.
             Chỉ hiển thị khi Tab hiện tại có items
             ========================================================================== */}
          {activeSection.items && activeSection.items.length > 0 && (
            <motion.div
              initial={isCompact ? { opacity: 0 } : { width: 0, opacity: 0 }}
              animate={isCompact ? { opacity: 1 } : { width: 220, opacity: 1 }}
              exit={isCompact ? { opacity: 0 } : { width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={
                isCompact
                  ? {
                      background: '#FAFAFA',
                      borderBottom: '1px solid #F0F0F0',
                      display: 'flex',
                      flexDirection: 'row',
                      padding: '10px 12px',
                      gap: 8,
                      flexShrink: 0,
                      overflowX: 'auto',
                      WebkitOverflowScrolling: 'touch',
                    }
                  : {
                      width: 220,
                      background: '#FAFAFA',
                      borderRight: '1px solid #F0F0F0',
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '20px 10px',
                      gap: 4,
                      flexShrink: 0,
                      overflowY: 'auto',
                    }
              }
            >
              {!isCompact && (
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: '#8C8C8C',
                    padding: '0 10px 8px 10px',
                    letterSpacing: '0.5px',
                  }}
                >
                  {activeSection.label}
                </div>
              )}

              {activeSection.items.map((item) => {
                const isSubActive = item.key === activeSubKey
                const Icon = item.icon

                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveSubKey(item.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: isCompact ? '8px 14px' : '9px 12px',
                      borderRadius: isCompact ? 999 : 8,
                      border: isCompact
                        ? `1px solid ${isSubActive ? '#91CAFF' : '#E8E8E8'}`
                        : 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: 13.5,
                      fontWeight: isSubActive ? 600 : 400,
                      background: isSubActive
                        ? '#E6F4FF'
                        : isCompact
                          ? '#FFFFFF'
                          : 'transparent',
                      color: isSubActive ? '#0958D9' : '#434343',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {Icon && (
                      <Icon
                        size={16}
                        color={isSubActive ? '#0958D9' : '#8C8C8C'}
                        style={{ flexShrink: 0 }}
                      />
                    )}
                    <span
                      style={
                        isCompact
                          ? undefined
                          : {
                              flex: 1,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }
                      }
                    >
                      {item.label}
                    </span>

                    {item.badge && (
                      <span
                        style={{
                          fontSize: 10,
                          padding: '1px 5px',
                          borderRadius: 4,
                          background: isSubActive ? '#BAE0FF' : '#E8E8E8',
                          color: isSubActive ? '#003EB3' : '#595959',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isSubActive && !isCompact && (
                      <ChevronRight size={14} color="#0958D9" />
                    )}
                  </button>
                )
              })}
            </motion.div>
          )}

          {/* ==========================================================================
             CỘT 3 / KHỐI CUỐI: MAIN CONTENT
             ========================================================================== */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              padding: isMobile
                ? '28px 20px'
                : isTablet
                  ? '30px 28px'
                  : '36px 40px',
              overflowY: 'auto',
              minHeight: 0,
            }}
          >
            {/* Nút đóng Modal */}
            <button
              onClick={() => onClose && onClose()}
              style={{
                position: 'absolute',
                top: isMobile ? 14 : 20,
                right: isMobile ? 14 : 24,
                width: 32,
                height: 32,
                borderRadius: 8,
                border: 'none',
                background: '#F5F5F5',
                color: '#595959',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              <X size={16} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSection.key}-${activeSubKey}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                {/* Badge & Chỉ số trang */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                    paddingRight: 36,
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  {activeSection.badge && (
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: '#E6F4FF',
                        color: '#0958D9',
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {activeSection.badge}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 12,
                      color: '#8C8C8C',
                      marginLeft: 'auto',
                    }}
                  >
                    Mục{' '}
                    <strong style={{ color: '#262626' }}>
                      {activeIndex + 1}
                    </strong>{' '}
                    / {sections.length}
                  </span>
                </div>

                {/* Tiêu đề Tab chính */}
                {activeSection.title && (
                  <h2
                    style={{
                      margin: '0 0 6px',
                      fontSize: isMobile ? 19 : 22,
                      fontWeight: 600,
                      color: '#262626',
                      lineHeight: 1.3,
                    }}
                  >
                    {activeSection.title}
                  </h2>
                )}

                {/* Subtitle / Tiêu đề mục con */}
                {currentSubItem ? (
                  <h4
                    style={{
                      margin: '0 0 18px',
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#1677FF',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <ChevronRight size={16} />
                    {currentSubItem.label}
                  </h4>
                ) : (
                  activeSection.subtitle && (
                    <p
                      style={{
                        margin: '0 0 18px',
                        fontSize: 14,
                        color: '#8C8C8C',
                      }}
                    >
                      {activeSection.subtitle}
                    </p>
                  )
                )}

                {/* Khối hiển thị Nội dung chính */}
                <div style={{ flex: 1, marginBottom: 20 }}>
                  {activeSection.items && activeSection.items.length > 0
                    ? (currentSubItem?.content ?? currentSubItem?.body)
                    : activeSection.content}
                </div>

                {/* Tip Callout ở chân trang */}
                {activeSection.tip && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: 8,
                      background: '#FAFAFA',
                      border: '1px solid #F0F0F0',
                      marginTop: 'auto',
                    }}
                  >
                    <Lightbulb
                      size={18}
                      color="#FAAD14"
                      style={{ flexShrink: 0, marginTop: 1 }}
                    />
                    <div
                      style={{
                        fontSize: 13,
                        color: '#595959',
                        lineHeight: 1.5,
                      }}
                    >
                      <strong style={{ color: '#262626' }}>Gợi ý: </strong>
                      {activeSection.tip}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default GuideBookModal
