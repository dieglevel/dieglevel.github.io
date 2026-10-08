import React, { useMemo, useState } from 'react'
import { Badge, Card, Empty, Progress, Space, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { Layers, PieChart as PieChartIcon } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { CategoryBreakdownItem } from '@/shared/api/financial/dashboard/dashboard.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Text } = Typography

const DEFAULT_CATEGORY_COLORS = [
  '#4f46e5', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
  '#84cc16', // Lime
  '#14b8a6', // Teal
]

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  mode: 'light' | 'dark'
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  mode,
}) => {
  const { border, background, shadow } = getTokens(mode)

  if (active && payload && payload.length) {
    const data = payload[0].payload as CategoryBreakdownItem

    return (
      <div
        style={{
          background: background.elevated,
          border: `1px solid ${border.base}`,
          padding: '10px 14px',
          borderRadius: 8,
          boxShadow: shadow.elevated,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
          {data.categoryName}
        </div>
        <div
          style={{
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <span style={{ color: '#64748b' }}>Chi tiêu:</span>
          <span style={{ fontWeight: 700, color: '#dc2626' }}>
            {convertCurrency(data.amount)} ({data.percentage}%)
          </span>
        </div>
      </div>
    )
  }
  return null
}

interface CategoryBreakdownChartProps {
  categoryBreakdown: Array<CategoryBreakdownItem>
}

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  categoryBreakdown,
}) => {
  const { t } = useTranslation('dashboard')
  const { mode } = useThemeMode()
  const { border, state, radius, background, text } = getTokens(mode)

  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const totalExpense = useMemo(() => {
    return categoryBreakdown.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  }, [categoryBreakdown])

  const activeCategory =
    activeIndex !== null && categoryBreakdown[activeIndex]
      ? categoryBreakdown[activeIndex]
      : null

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: radius.md,
              background: '#ec489918',
              color: '#ec4899',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PieChartIcon size={18} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 600 }}>
            {t('categoryBreakdown.title')}
          </span>
        </div>
      }
      extra={
        categoryBreakdown.length > 0 && (
          <Tag
            style={{
              borderRadius: radius.sm,
              margin: 0,
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {categoryBreakdown.length} {t('categoryBreakdown.countCategories')}
          </Tag>
        )
      }
      style={{
        borderRadius: radius.lg,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      styles={{
        body: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 20px',
        },
      }}
    >
      {categoryBreakdown.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 0',
          }}
        >
          <Empty description={t('categoryBreakdown.empty')} />
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          {/* Donut Chart with center label */}
          <div style={{ position: 'relative', width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="amount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {categoryBreakdown.map((entry, index) => {
                    const color =
                      entry.categoryColor ||
                      DEFAULT_CATEGORY_COLORS[
                        index % DEFAULT_CATEGORY_COLORS.length
                      ]
                    const isSelected = activeIndex === index
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={color}
                        opacity={
                          activeIndex === null || isSelected ? 1 : 0.5
                        }
                        stroke={background.base}
                        strokeWidth={isSelected ? 3 : 1}
                        style={{
                          cursor: 'pointer',
                          transition: 'opacity 0.2s ease, transform 0.2s ease',
                        }}
                      />
                    )
                  })}
                </Pie>
                <Tooltip content={<CustomTooltip mode={mode} />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Display */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
                maxWidth: 100,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {activeCategory
                  ? activeCategory.categoryName
                  : t('categoryBreakdown.totalSpent')}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: text.primary,
                  whiteSpace: 'nowrap',
                }}
              >
                {activeCategory
                  ? `${activeCategory.percentage}%`
                  : convertCurrency(totalExpense)}
              </div>
            </div>
          </div>

          {/* Category List with dynamic highlight & progress bars */}
          <div
            style={{
              marginTop: 10,
              maxHeight: 160,
              overflowY: 'auto',
              paddingRight: 6,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {categoryBreakdown.map((cat, idx) => {
              const color =
                cat.categoryColor ||
                DEFAULT_CATEGORY_COLORS[idx % DEFAULT_CATEGORY_COLORS.length]
              const isSelected = activeIndex === idx

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  style={{
                    padding: '6px 8px',
                    borderRadius: radius.sm,
                    background: isSelected ? state.hover : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginRight: 8,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontWeight: isSelected ? 600 : 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {cat.categoryName}
                      </span>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <span style={{ fontWeight: 600, color: text.primary }}>
                        {convertCurrency(cat.amount)}
                      </span>{' '}
                      <span style={{ color: '#64748b', fontSize: 11 }}>
                        ({cat.percentage}%)
                      </span>
                    </div>
                  </div>
                  <Progress
                    percent={cat.percentage}
                    showInfo={false}
                    strokeColor={color}
                    size="small"
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Card>
  )
}
