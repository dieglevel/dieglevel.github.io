import React from 'react'
import { Card, Empty } from 'antd'
import { Calendar } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CashFlowTimelinePoint } from '@/shared/api/financial/dashboard/dashboard.type'

const formatVND = (val: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(val || 0)
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          padding: '10px 14px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          color: '#1e293b',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 6, color: '#64748b' }}>
          {label}
        </div>
        {payload.map((entry: any, index: number) => (
          <div
            key={`item-${index}`}
            style={{
              color: entry.color,
              fontSize: 13,
              display: 'flex',
              gap: 12,
              justifyContent: 'space-between',
            }}
          >
            <span>{entry.name}:</span>
            <span style={{ fontWeight: 600 }}>{formatVND(entry.value)}</span>
          </div>
        ))}
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
  return (
    <Card
      title={
        <span
          style={{
            color: '#0f172a',
            fontSize: '16px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Calendar size={18} color="#0284c7" /> Biểu Đồ Dòng Tiền Thu / Chi
        </span>
      }
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      {cashFlowTimeline.length === 0 ? (
        <Empty description="Chưa có dữ liệu giao dịch" />
      ) : (
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={cashFlowTimeline}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) =>
                  v >= 1000000
                    ? `${(v / 1000000).toFixed(1)}M`
                    : `${(v / 1000).toFixed(0)}k`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                name="Thu nhập"
                stroke="#16a34a"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIncome)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="Chi tiêu"
                stroke="#dc2626"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExpense)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
