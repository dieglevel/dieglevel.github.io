import React, { Suspense, lazy, useMemo, useState } from 'react'
import { Button, Empty, Input, Popover, theme } from 'antd'
import { HelpCircle, Search } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import type { UIEvent } from 'react'

const ALL_ICON_NAMES = Object.keys(dynamicIconImports) as Array<
  keyof typeof dynamicIconImports
>
const ITEMS_PER_PAGE = 40

// Helper: Chuyển đổi mọi định dạng (PascalCase, camelCase) về kebab-case chuẩn của dynamicIconImports
const normalizeIconName = (
  name?: string,
): keyof typeof dynamicIconImports | null => {
  if (!name) return null

  // Chuyển PascalCase/camelCase sang kebab-case (VD: "ArrowRight" -> "arrow-right")
  const kebab = name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
    .trim() as keyof typeof dynamicIconImports

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return dynamicIconImports[kebab] ? kebab : null
}

// Map cache các lazy component để tránh re-create component khi re-render
const iconCache = new Map<
  string,
  React.LazyExoticComponent<React.ComponentType<any>>
>()

const getLazyIcon = (name: keyof typeof dynamicIconImports) => {
  if (!iconCache.has(name)) {
    iconCache.set(name, lazy(dynamicIconImports[name]))
  }
  return iconCache.get(name)!
}

// 2. Component Render Icon động
const DynamicLucideIcon = React.memo(
  ({ name, size = 18 }: { name: string; size?: number }) => {
    const validKey = normalizeIconName(name)

    if (!validKey) {
      return <HelpCircle size={size} />
    }

    const IconComponent = getLazyIcon(validKey)

    return (
      <Suspense fallback={<div style={{ width: size, height: size }} />}>
        <IconComponent size={size} strokeWidth={1.5} />
      </Suspense>
    )
  },
)

interface IconPickerProps {
  value?: string
  onChange?: (iconName: string) => void
  color?: string
}

export const IconPicker: React.FC<IconPickerProps> = ({
  value = undefined,
  onChange = (_) => {},
  color,
}) => {
  console.log(value)
  const [visible, setVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const { token } = theme.useToken()

  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return ALL_ICON_NAMES
    const query = searchQuery.toLowerCase().trim()
    return ALL_ICON_NAMES.filter((name) => name.toLowerCase().includes(query))
  }, [searchQuery])

  const displayedIcons = useMemo(() => {
    return filteredIcons.slice(0, visibleCount)
  }, [filteredIcons, visibleCount])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setVisibleCount(ITEMS_PER_PAGE)
  }

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 20

    if (isAtBottom && visibleCount < filteredIcons.length) {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
    }
  }

  const popoverContent = (
    <div
      style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <Input
        placeholder="Search icon..."
        prefix={<Search size={14} color={token.colorTextDescription} />}
        value={searchQuery}
        onChange={handleSearchChange}
        allowClear
      />

      <div
        onScroll={handleScroll}
        style={{ maxHeight: 240, overflowY: 'auto', paddingRight: 4 }}
      >
        {displayedIcons.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Do not find any icon"
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
              const normalizedValue = normalizeIconName(value)
              const isSelected = normalizedValue === iconName

              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => {
                    // Trả về iconName chuẩn kebab-case cho Form
                    onChange(iconName)
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
                    transition: 'background-color 0.2s',
                    outline: 'none',
                  }}
                >
                  <DynamicLucideIcon name={iconName} size={18} />
                </button>
              )
            })}
          </div>
        )}

        {visibleCount < filteredIcons.length && (
          <div
            style={{
              textAlign: 'center',
              padding: '8px 0',
              fontSize: 11,
              color: token.colorTextDescription,
            }}
          >
            Loading...
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
          padding: 0,
          borderColor: color ? `${color}20` : token.colorBgContainer,
          backgroundColor: color ? `${color}10` : token.colorBgContainer,
          color: color || token.colorText,
        }}
      >
        {value ? (
          <DynamicLucideIcon name={value} size={16} />
        ) : (
          <HelpCircle size={16} style={{ color }} />
        )}
      </Button>
    </Popover>
  )
}
