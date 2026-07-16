import React, { useMemo, useState } from 'react'
import { Button, Empty, Input, Popover, Tooltip, theme } from 'antd'
import * as LucideIcons from 'lucide-react'
import type { UIEvent } from 'react'

// Lọc danh sách key icon hợp lệ từ Lucide
const AVAILABLE_ICONS = Object.keys(LucideIcons).filter(
  (key) =>
    key !== 'createReactComponent' &&
    typeof (LucideIcons as any)[key] === 'object',
)

const ITEMS_PER_PAGE = 50 // Mỗi lần cuộn xuống sẽ load thêm 50 icon

interface IconPickerProps {
  value?: string
  onChange?: (iconName: string) => void
  color?: string
}

export const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onChange,
  color,
}) => {
  const [visible, setVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE) // Số lượng icon hiện tại đang hiển thị

  const { token } = theme.useToken()
  const SelectedIcon =
    value && (LucideIcons as any)[value]
      ? (LucideIcons as any)[value]
      : LucideIcons.HelpCircle

  // 1. Xử lý bộ lọc tìm kiếm
  const filteredIcons = useMemo(() => {
    if (!searchQuery) return AVAILABLE_ICONS
    return AVAILABLE_ICONS.filter((icon) =>
      icon.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery])

  // 2. Cắt mảng dữ liệu để hiển thị theo cơ chế Infinite Scroll
  const displayedIcons = useMemo(() => {
    return filteredIcons.slice(0, visibleCount)
  }, [filteredIcons, visibleCount])

  // Reset số lượng icon hiển thị về ban đầu khi người dùng gõ tìm kiếm mới
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setVisibleCount(ITEMS_PER_PAGE)
  }

  // 3. Bắt sự kiện cuộn (Scroll Event) để load thêm data
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget

    // Kiểm tra nếu người dùng đã cuộn sát đáy (cách đáy dưới 10px)
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 10

    if (isAtBottom && visibleCount < filteredIcons.length) {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
    }
  }

  const popoverContent = (
    <div
      style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <Input
        placeholder="Tìm kiếm icon..."
        prefix={React.createElement((LucideIcons as any)['Search'], {
          size: 14,
          color: token.colorTextDescription,
        })}
        value={searchQuery}
        onChange={handleSearchChange}
        allowClear
      />

      {/* Vùng scroll kích hoạt tính năng Infinite Scroll */}
      <div
        onScroll={handleScroll}
        style={{ maxHeight: 240, overflowY: 'auto', paddingRight: 4 }}
      >
        {displayedIcons.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không tìm thấy icon"
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: 6,
              padding: 2,
            }}
          >
            {displayedIcons.map((iconName) => {
              const IconComponent = (LucideIcons as any)[iconName]
              const isSelected = value === iconName

              return (
                <Tooltip title={iconName} key={iconName} mouseEnterDelay={0.4}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange?.(iconName)
                      setVisible(false)
                    }}
                    style={{
                      aspectRatio: '1 / 1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid transparent',
                      borderRadius: token.borderRadiusSM,
                      backgroundColor: isSelected
                        ? token.colorPrimaryBg
                        : 'transparent',
                      color: isSelected ? token.colorPrimary : token.colorText,
                      cursor: 'pointer',
                      fontSize: 18,
                      transition: 'all 0.2s',
                      outline: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.backgroundColor =
                          token.colorBgTextHover
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <IconComponent size={18} strokeWidth={1.5} />
                  </button>
                </Tooltip>
              )
            })}
          </div>
        )}

        {/* Chỉ báo nhỏ cho biết còn icon để cuộn tiếp */}
        {visibleCount < filteredIcons.length && (
          <div
            style={{
              textAlign: 'center',
              padding: '8px 0',
              fontSize: 11,
              color: token.colorTextDescription,
            }}
          >
            Đang tải thêm...
          </div>
        )}
      </div>
    </div>
  )

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      open={visible}
      onOpenChange={(open) => {
        setVisible(open)
        if (!open) {
          // Reset trạng thái khi đóng popover để tiết kiệm tài nguyên
          setSearchQuery('')
          setVisibleCount(ITEMS_PER_PAGE)
        }
      }}
      placement="bottomLeft"
    >
      <Button
        style={{
          height: 32,
          width: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'left',
          padding: 0,
          borderColor: color ? `${color}20` : token.colorBgContainer,
          backgroundColor: color ? `${color}10` : token.colorBgContainer,
        }}
      >
        <SelectedIcon size={16} style={{ flexShrink: 0, color }} />
      </Button>
    </Popover>
  )
}
