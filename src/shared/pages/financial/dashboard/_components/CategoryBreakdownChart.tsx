import React from 'react'
import { Card, Empty, Progress } from 'antd'
import { PieChart as PieChartIcon } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { CategoryBreakdownItem } from '@/shared/api/financial/dashboard/dashboard.type'

const CATEGORY_COLORS = [
  '#4f46e5', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
]

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

interface CategoryBreakdownChartProps {
  categoryBreakdown: CategoryBreakdownItem[]
}

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  categoryBreakdown,
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
          <PieChartIcon size={18} color="#ec4899" /> Cơ Cấu Chi Tiêu
        </span>
      }
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      {categoryBreakdown.length === 0 ? (
        <Empty description="Chưa có dữ liệu chi tiêu" />
      ) : (
        <div>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="amount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.categoryColor ||
                        CATEGORY_COLORS[index % CATEGORY_COLORS.length]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Progress bars list */}
          <div
            style={{
              marginTop: 12,
              maxHeight: 130,
              overflowY: 'auto',
              paddingRight: 6,
            }}
          >
            {categoryBreakdown.slice(0, 4).map((cat, idx) => (
              <div key={idx} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: '#0f172a', fontWeight: 500 }}>
                    {cat.categoryName}
                  </span>
                  <span style={{ color: '#64748b' }}>
                    {formatVND(cat.amount)} ({cat.percentage}%)
                  </span>
                </div>
                <Progress
                  percent={cat.percentage}
                  showInfo={false}
                  strokeColor={
                    cat.categoryColor ||
                    CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
                  }
                  trailColor="#f1f5f9"
                  size="small"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
