import React, { useMemo, useState } from 'react'
import { Empty, Segmented, Table, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { Activity } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import dayjs from 'dayjs'
import { WidgetCard } from './WidgetCard'
import { formatCompact, getVizColors } from './viz'
import type { CashFlowTimelinePoint } from '@/shared/api/financial/dashboard/dashboard.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Text } = Typography

type ViewMode = 'flow' | 'net' | 'table'

/** "2026-11-05" → 05/11 · "2026-11" → 11/26 */
const formatTick = (date: string) =>
  date.length === 10
    ? dayjs(date).format('DD/MM')
    : date.length === 7
      ? dayjs(date).format('MM/YY')
      : date

const formatFull = (date: string) =>
  date.length === 10
    ? dayjs(date).format('DD/MM/YYYY')
    : date.length === 7
      ? dayjs(date).format('MM/YYYY')
      : date

const Swatch: React.FC<{ color: string; line?: boolean }> = ({
  color,
  line,
}) => (
  <span
    aria-hidden
    style={{
      display: 'inline-block',
      width: line ? 14 : 10,
      height: line ? 3 : 10,
      borderRadius: line ? 2 : 3,
      background: color,
      flexShrink: 0,
    }}
  />
)

interface TooltipRow {
  label: string
  value: number
  color: string
  signed?: boolean
}

const ChartTooltip: React.FC<{
  active?: boolean
  label?: string
  rows: (point: CashFlowTimelinePoint) => Array<TooltipRow>
  payload?: Array<{ payload: CashFlowTimelinePoint }>
}> = ({ active, label, payload, rows }) => {
  const { mode } = useThemeMode()
  const { background, border, shadow } = getTokens(mode)
  if (!active || !payload?.length) return null

  return (
    <div
      style={{
        background: background.elevated,
        border: `1px solid ${border.base}`,
        borderRadius: 8,
        boxShadow: shadow.elevated,
        padding: '10px 12px',
        minWidth: 180,
      }}
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>
        {formatFull(label || '')}
      </Text>
      {rows(payload[0].payload).map((r) => (
        <div
          key={r.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Swatch color={r.color} line />
            <Text>{r.label}</Text>
          </span>
          <Text strong>
            {r.signed && r.value > 0 ? '+' : r.value < 0 ? '−' : ''}
            {convertCurrency(Math.abs(r.value))}
          </Text>
        </div>
      ))}
    </div>
  )
}

interface CashFlowChartProps {
  cashFlowTimeline: Array<CashFlowTimelinePoint>
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  cashFlowTimeline,
}) => {
  const { t } = useTranslation('dashboard')
  const { mode } = useThemeMode()
  const { background } = getTokens(mode)
  const viz = getVizColors(mode)

  const [view, setView] = useState<ViewMode>('flow')

  const data = useMemo(
    () =>
      cashFlowTimeline.map((p) => {
        const income = Number(p.income || 0)
        const expense = Number(p.expense || 0)
        return { ...p, income, expense, net: income - expense }
      }),
    [cashFlowTimeline],
  )

  const totals = useMemo(
    () =>
      data.reduce(
        (acc, p) => ({
          income: acc.income + p.income,
          expense: acc.expense + p.expense,
        }),
        { income: 0, expense: 0 },
      ),
    [data],
  )
  const net = totals.income - totals.expense

  const flowRows = (p: CashFlowTimelinePoint): Array<TooltipRow> => [
    { label: t('cashFlow.income'), value: p.income, color: viz.income },
    { label: t('cashFlow.expense'), value: p.expense, color: viz.expense },
    {
      label: t('cashFlow.net'),
      value: p.income - p.expense,
      color: 'transparent',
      signed: true,
    },
  ]
  const netRows = (p: CashFlowTimelinePoint): Array<TooltipRow> => [
    {
      label: t('cashFlow.net'),
      value: p.income - p.expense,
      color: p.income - p.expense >= 0 ? viz.income : viz.expense,
      signed: true,
    },
  ]

  // Lưới & trục: hairline liền, chữ trục màu chữ phụ
  const axisProps = {
    stroke: viz.grid,
    tick: { fill: viz.axis, fontSize: 12 },
    tickLine: false,
    axisLine: false,
  }

  const legend =
    view === 'net' ? (
      <>
        <LegendItem color={viz.income} label={t('cashFlow.netPositive')} />
        <LegendItem color={viz.expense} label={t('cashFlow.netNegative')} />
        <LegendItem
          label={t('cashFlow.net')}
          value={`${net > 0 ? '+' : net < 0 ? '−' : ''}${convertCurrency(Math.abs(net))}`}
        />
      </>
    ) : (
      <>
        <LegendItem
          color={viz.income}
          line
          label={t('cashFlow.income')}
          value={convertCurrency(totals.income)}
        />
        <LegendItem
          color={viz.expense}
          line
          label={t('cashFlow.expense')}
          value={convertCurrency(totals.expense)}
        />
        <LegendItem
          label={t('cashFlow.net')}
          value={`${net > 0 ? '+' : net < 0 ? '−' : ''}${convertCurrency(Math.abs(net))}`}
        />
      </>
    )

  return (
    <WidgetCard
      icon={<Activity size={18} />}
      title={t('cashFlow.title')}
      extra={
        <Segmented<ViewMode>
          value={view}
          onChange={setView}
          options={[
            { label: t('cashFlow.viewAll'), value: 'flow' },
            { label: t('cashFlow.viewNet'), value: 'net' },
            { label: t('cashFlow.viewTable'), value: 'table' },
          ]}
        />
      }
    >
      {data.length === 0 ? (
        <div style={{ padding: '60px 0' }}>
          <Empty description={t('cashFlow.empty')} />
        </div>
      ) : (
        <>
          {/* Chú giải + tổng kỳ (luôn hiện, không phụ thuộc tooltip) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px 24px',
              marginBottom: 12,
            }}
          >
            {legend}
          </div>

          {view === 'table' ? (
            <Table
              size="small"
              rowKey="date"
              dataSource={data}
              pagination={{ pageSize: 8, showSizeChanger: false }}
              columns={[
                {
                  title: t('cashFlow.date'),
                  dataIndex: 'date',
                  render: formatFull,
                },
                {
                  title: t('cashFlow.income'),
                  dataIndex: 'income',
                  align: 'right',
                  render: (v: number) => convertCurrency(v),
                },
                {
                  title: t('cashFlow.expense'),
                  dataIndex: 'expense',
                  align: 'right',
                  render: (v: number) => convertCurrency(v),
                },
                {
                  title: t('cashFlow.net'),
                  dataIndex: 'net',
                  align: 'right',
                  render: (v: number) => (
                    <Text type={v < 0 ? 'danger' : undefined}>
                      {v > 0 ? '+' : v < 0 ? '−' : ''}
                      {convertCurrency(Math.abs(v))}
                    </Text>
                  ),
                },
              ]}
            />
          ) : (
            // Chiều cao gồm cả dải nhãn trục X — không bị cắt/cuộn lồng
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                {view === 'flow' ? (
                  <LineChart
                    data={data}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid stroke={viz.grid} vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatTick}
                      minTickGap={16}
                      {...axisProps}
                    />
                    <YAxis
                      tickFormatter={formatCompact}
                      width={48}
                      {...axisProps}
                    />
                    <Tooltip
                      cursor={{ stroke: viz.axis, strokeWidth: 1 }}
                      content={<ChartTooltip rows={flowRows} />}
                    />
                    {(['income', 'expense'] as const).map((key) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        name={t(`cashFlow.${key}`)}
                        stroke={viz[key]}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                          r: 4,
                          fill: viz[key],
                          stroke: background.base,
                          strokeWidth: 2,
                        }}
                      />
                    ))}
                  </LineChart>
                ) : (
                  <BarChart
                    data={data}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    barCategoryGap={2}
                  >
                    <CartesianGrid stroke={viz.grid} vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatTick}
                      minTickGap={16}
                      {...axisProps}
                    />
                    <YAxis
                      tickFormatter={formatCompact}
                      width={48}
                      {...axisProps}
                    />
                    <ReferenceLine y={0} stroke={viz.axis} />
                    <Tooltip
                      cursor={{ fill: viz.grid, opacity: 0.6 }}
                      content={<ChartTooltip rows={netRows} />}
                    />
                    <Bar dataKey="net" maxBarSize={24}>
                      {data.map((p) => (
                        <Cell
                          key={p.date}
                          fill={p.net >= 0 ? viz.income : viz.expense}
                          // Bo 4px ở đầu xa đường 0
                          radius={
                            (p.net >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]) as any
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </WidgetCard>
  )
}

const LegendItem: React.FC<{
  color?: string
  line?: boolean
  label: string
  value?: string
}> = ({ color, line, label, value }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
    {color && <Swatch color={color} line={line} />}
    <Text type="secondary">{label}</Text>
    {value && <Text strong>{value}</Text>}
  </span>
)
