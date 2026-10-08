import React, { useMemo, useState } from 'react'
import { Card, Empty, Flex, Segmented, Space, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import dayjs from 'dayjs'
import type { CashFlowTimelinePoint } from '@/shared/api/financial/dashboard/dashboard.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Text } = Typography

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  mode: 'light' | 'dark'
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  mode,
}) => {
  const { border, background, shadow } = getTokens(mode)

  if (active && payload && payload.length) {
    const formattedLabel =
      label && label.length === 10
        ? dayjs(label).format('DD/MM/YYYY')
        : label && label.length === 7
          ? dayjs(label).format('MM/YYYY')
          : label

    return (
      <div
        style={{
          background: background.elevated,
          border: `1px solid ${border.base}`,
          padding: '12px 16px',
          borderRadius: 10,
          boxShadow: shadow.elevated,
          minWidth: 180,
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: 12,
            marginBottom: 8,
            color: '#64748b',
          }}
        >
          {formattedLabel}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {payload.map((entry: any, index: number) => (
            <div
              key={`item-${index}`}
              style={{
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: entry.color,
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: entry.color,
                    display: 'inline-block',
                  }}
                />
                {entry.name}:
              </span>
              <span style={{ fontWeight: 600 }}>
                {convertCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

interface CashFlowChartProps {
  cashFlowTimeline: Array<CashFlowTimelinePoint>
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  cashFlowTimeline,
}) => {
  const { t } = useTranslation('dashboard')
  const { mode } = useThemeMode()
  const { border, radius } = getTokens(mode)
  const isDark = mode === 'dark'

  const [viewMode, setViewMode] = useState<'both' | 'net'>('both')

  // Calculate period sums
  const { totalIncome, totalExpense, totalNet } = useMemo(() => {
    return cashFlowTimeline.reduce(
      (acc, item) => {
        acc.totalIncome += Number(item.income || 0)
        acc.totalExpense += Number(item.expense || 0)
        acc.totalNet += Number(item.net ?? (item.income - item.expense))
        return acc
      },
      { totalIncome: 0, totalExpense: 0, totalNet: 0 },
    )
  }, [cashFlowTimeline])

  const formatXAxis = (dateStr: string) => {
    if (!dateStr) return ''
    if (dateStr.length === 10) return dayjs(dateStr).format('DD/MM')
    if (dateStr.length === 7) return dayjs(dateStr).format('MM/YY')
    return dateStr
  }

  const formatYAxis = (val: number) => {
    const absVal = Math.abs(val)
    if (absVal >= 1000000) return `${(val / 1000000).toFixed(1)}M`
    if (absVal >= 1000) return `${(val / 1000).toFixed(0)}k`
    return `${val}`
  }

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: radius.md,
              background: '#0284c718',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calendar size={18} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.2 }}>
              {t('cashFlow.title')}
            </div>
          </div>
        </div>
      }
      extra={
        <Space wrap size="middle">
          {/* Quick period summary badges */}
          <Space size={8}>
            <Tag
              color="success"
              style={{
                borderRadius: radius.sm,
                margin: 0,
                padding: '2px 8px',
                fontSize: 12,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <ArrowUpRight size={14} />
              +{convertCurrency(totalIncome)}
            </Tag>
            <Tag
              color="error"
              style={{
                borderRadius: radius.sm,
                margin: 0,
                padding: '2px 8px',
                fontSize: 12,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <ArrowDownRight size={14} />
              -{convertCurrency(totalExpense)}
            </Tag>
          </Space>

          {/* Toggle View Mode */}
          <Segmented
            size="small"
            value={viewMode}
            onChange={(val) => setViewMode(val as 'both' | 'net')}
            options={[
              { label: t('cashFlow.viewAll'), value: 'both' },
              { label: t('cashFlow.viewNet'), value: 'net' },
            ]}
          />
        </Space>
      }
      style={{
        borderRadius: radius.lg,
      }}
      styles={{ body: { padding: '20px 20px 14px 10px' } }}
    >
      {cashFlowTimeline.length === 0 ? (
        <div style={{ padding: '60px 0' }}>
          <Empty description={t('cashFlow.empty')} />
        </div>
      ) : (
        <div style={{ width: '100%', height: 330 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={cashFlowTimeline}
              margin={{ top: 12, right: 16, left: 4, bottom: 4 }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? '#334155' : border.base}
                vertical={false}
              />

              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                tickFormatter={formatXAxis}
              />

              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                tickFormatter={formatYAxis}
              />

              <Tooltip content={<CustomTooltip mode={mode} />} />

              {viewMode === 'both' ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="income"
                    name={t('cashFlow.income')}
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    name={t('cashFlow.expense')}
                    stroke="#dc2626"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                  />
                </>
              ) : (
                <>
                  <ReferenceLine
                    y={0}
                    stroke={isDark ? '#64748b' : '#94a3b8'}
                    strokeDasharray="3 3"
                  />
                  <Area
                    type="monotone"
                    dataKey="net"
                    name={t('cashFlow.net')}
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorNet)"
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
