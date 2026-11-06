import React from 'react'
import { Button, Card, Typography } from 'antd'
import { ArrowUpRight } from 'lucide-react'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Text } = Typography

interface WidgetCardProps {
  icon: React.ReactNode
  title: string
  /** Dòng phụ nhỏ dưới tiêu đề (vd: tổng kỳ) */
  subtitle?: React.ReactNode
  /** Link góc phải, vd "Xem tất cả" */
  action?: { label: string; onClick: () => void }
  extra?: React.ReactNode
  children: React.ReactNode
}

/** Khung card dùng chung cho các widget dashboard: icon + tiêu đề + link */
export const WidgetCard: React.FC<WidgetCardProps> = ({
  icon,
  title,
  subtitle,
  action,
  extra,
  children,
}) => {
  const { mode } = useThemeMode()
  const { radius, colors } = getTokens(mode)

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            aria-hidden
            style={{
              width: 32,
              height: 32,
              flexShrink: 0,
              borderRadius: radius.md,
              background: colors.primary.soft,
              color: colors.primary.text,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {icon}
          </span>
          <div style={{ minWidth: 0 }}>
            <Text strong style={{ display: 'block' }}>
              {title}
            </Text>
            {subtitle && (
              <Text
                type="secondary"
                style={{ display: 'block', fontWeight: 400 }}
              >
                {subtitle}
              </Text>
            )}
          </div>
        </div>
      }
      extra={
        extra ??
        (action && (
          <Button
            type="link"
            onClick={action.onClick}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            {action.label}
            <ArrowUpRight size={14} aria-hidden />
          </Button>
        ))
      }
      style={{
        borderRadius: radius.lg,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      styles={{
        header: { paddingBlock: 12 },
        body: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 20px',
        },
      }}
    >
      {children}
    </Card>
  )
}
