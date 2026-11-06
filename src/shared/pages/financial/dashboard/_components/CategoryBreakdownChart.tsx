import React, { useMemo, useState } from 'react'
import { Empty, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { PieChart } from 'lucide-react'
import { WidgetCard } from './WidgetCard'
import { SegmentedBar } from './SegmentedBar'
import { MAX_CATEGORY_SLOTS, getVizColors } from './viz'
import type { CategoryBreakdownItem } from '@/shared/api/financial/dashboard/dashboard.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Title, Text } = Typography

const OTHER_KEY = 'other'

interface Row {
  key: string | number
  name: string
  amount: number
  percent: number
  color: string
}

interface CategoryBreakdownChartProps {
  categoryBreakdown: Array<CategoryBreakdownItem>
}

/**
 * Cơ cấu chi tiêu: thanh tỉ trọng mảnh + danh sách xếp hạng.
 * Tối đa 5 danh mục lớn nhất, phần còn lại gộp vào "Khác" (không sinh thêm màu).
 */
export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  categoryBreakdown,
}) => {
  const { t } = useTranslation('dashboard')
  const { mode } = useThemeMode()
  const { state, radius } = getTokens(mode)
  const viz = getVizColors(mode)
  const [activeKey, setActiveKey] = useState<string | number | null>(null)

  const { rows, total } = useMemo(() => {
    const sorted = [...categoryBreakdown].sort(
      (a, b) => Number(b.amount) - Number(a.amount),
    )
    const sum = sorted.reduce((s, c) => s + Number(c.amount || 0), 0)
    const pct = (v: number) => (sum > 0 ? Math.round((v / sum) * 1000) / 10 : 0)

    const head: Array<Row> = sorted
      .slice(0, MAX_CATEGORY_SLOTS)
      .map((c, i) => ({
        key: c.categoryId ?? `none-${i}`,
        name: c.categoryName || t('categoryBreakdown.uncategorized'),
        amount: Number(c.amount || 0),
        percent: pct(Number(c.amount || 0)),
        // Màu riêng của danh mục (nhất quán toàn app) → nếu không có thì theo slot cố định
        color: c.categoryColor || viz.categorical[i],
      }))

    const tail = sorted.slice(MAX_CATEGORY_SLOTS)
    if (tail.length > 0) {
      const amount = tail.reduce((s, c) => s + Number(c.amount || 0), 0)
      head.push({
        key: OTHER_KEY,
        name: t('categoryBreakdown.other', { count: tail.length }),
        amount,
        percent: pct(amount),
        color: viz.other,
      })
    }
    return { rows: head, total: sum }
  }, [categoryBreakdown, viz, t])

  return (
    <WidgetCard
      icon={<PieChart size={18} />}
      title={t('categoryBreakdown.title')}
      extra={
        categoryBreakdown.length > 0 && (
          <Text type="secondary">
            {t('categoryBreakdown.countCategories', {
              count: categoryBreakdown.length,
            })}
          </Text>
        )
      }
    >
      {rows.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'grid',
            placeItems: 'center',
            padding: '60px 0',
          }}
        >
          <Empty description={t('categoryBreakdown.empty')} />
        </div>
      ) : (
        <>
          <Text type="secondary">{t('categoryBreakdown.totalSpent')}</Text>
          <Title level={3} style={{ margin: '0 0 12px' }}>
            {convertCurrency(total)}
          </Title>

          <SegmentedBar
            ariaLabel={t('categoryBreakdown.title')}
            activeKey={activeKey}
            onHover={setActiveKey}
            segments={rows.map((r) => ({
              key: r.key,
              label: r.name,
              value: r.amount,
              color: r.color,
              detail: `${convertCurrency(r.amount)} · ${r.percent}%`,
            }))}
          />

          <ul
            style={{
              listStyle: 'none',
              margin: '16px 0 0',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
            onMouseLeave={() => setActiveKey(null)}
          >
            {rows.map((r, i) => (
              <li
                key={r.key}
                onMouseEnter={() => setActiveKey(r.key)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '20px 10px minmax(0, 1fr) auto 52px',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 8px',
                  borderRadius: radius.sm,
                  background: activeKey === r.key ? state.hover : 'transparent',
                  transition: 'background 0.15s ease',
                }}
              >
                <Text type="secondary">{r.key === OTHER_KEY ? '' : i + 1}</Text>
                <span
                  aria-hidden
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    background: r.color,
                  }}
                />
                <Text ellipsis={{ tooltip: r.name }}>{r.name}</Text>
                <Text strong>{convertCurrency(r.amount)}</Text>
                <Text type="secondary" style={{ textAlign: 'right' }}>
                  {r.percent}%
                </Text>
              </li>
            ))}
          </ul>
        </>
      )}
    </WidgetCard>
  )
}
