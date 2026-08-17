import React, { useState } from 'react'
import { Card, Col, Flex, Radio, Row, Typography } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  PieChart as PieIcon,
  Wallet,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Text } = Typography

interface TransactionsSummaryProps {
  totalIncome?: number
  totalExpense?: number
}

export const TransactionsSummary: React.FC<TransactionsSummaryProps> = ({
  totalIncome,
  totalExpense,
}) => {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar')

  // Tính toán dữ liệu tài chính
  const income = totalIncome || 0
  const expense = totalExpense || 0

  const net = income - expense
  const totalVolume = income + expense

  // Tỷ lệ phần trăm cho Donut Chart
  const incomePercent =
    totalVolume > 0 ? Math.round((income / totalVolume) * 100) : 0

  // Dữ liệu cho Recharts
  const chartData = [
    { name: 'Income', amount: income, color: '#10b981' },
    { name: 'Expense', amount: expense, color: '#f43f5e' },
  ]

  // Custom Tooltip tinh chỉnh UI
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            padding: '8px 12px',
            border: '1px solid #f0f0f0',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        >
          <Flex align="center" gap={6} style={{ marginBottom: 2 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: data.payload.color || data.color,
              }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {data.name}
            </Text>
          </Flex>
          <Text strong style={{ fontSize: 14, color: '#1f2937' }}>
            {convertCurrency(data.value)}
          </Text>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        size="small"
        bordered={false}
        style={{
          borderRadius: 16,
          boxShadow:
            '0 1px 3px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.03)',
          background: '#ffffff',
        }}
      >
        <Row gutter={[20, 20]} align="middle">
          {/* Cột trái: Thống kê dạng Card Mini */}
          <Col xs={24} md={10} lg={9}>
            <Flex vertical gap={12}>
              <Flex justify="space-between" align="center">
                <Text
                  type="secondary"
                  strong
                  style={{ fontSize: 11, letterSpacing: '0.5px' }}
                >
                  OVERVIEW
                </Text>

                {/* Switch Chart với Segmented UI gọn gàng */}
                <Radio.Group
                  size="small"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  optionType="button"
                  buttonStyle="solid"
                >
                  <Radio.Button value="bar">
                    <Flex align="center" gap={4}>
                      <BarChart3 size={13} />
                      Bar
                    </Flex>
                  </Radio.Button>
                  <Radio.Button value="pie">
                    <Flex align="center" gap={4}>
                      <PieIcon size={13} />
                      Pie
                    </Flex>
                  </Radio.Button>
                </Radio.Group>
              </Flex>

              {/* Grid 3 Stat Badge */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(1, 1fr)',
                  gap: 8,
                }}
              >
                {/* Income Mini-Card */}
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: 10,
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #dcfce7',
                  }}
                >
                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap={8}>
                      <div
                        style={{
                          padding: 4,
                          borderRadius: 6,
                          backgroundColor: '#bbf7d0',
                          color: '#16a34a',
                          display: 'flex',
                        }}
                      >
                        <ArrowDownRight size={14} />
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Income
                      </Text>
                    </Flex>
                    <Text strong style={{ color: '#15803d', fontSize: 14 }}>
                      {convertCurrency(income)}
                    </Text>
                  </Flex>
                </div>

                {/* Expense Mini-Card */}
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: 10,
                    backgroundColor: '#fff1f2',
                    border: '1px solid #ffe4e6',
                  }}
                >
                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap={8}>
                      <div
                        style={{
                          padding: 4,
                          borderRadius: 6,
                          backgroundColor: '#fecdd3',
                          color: '#e11d48',
                          display: 'flex',
                        }}
                      >
                        <ArrowUpRight size={14} />
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Expenses
                      </Text>
                    </Flex>
                    <Text strong style={{ color: '#be123c', fontSize: 14 }}>
                      {convertCurrency(expense)}
                    </Text>
                  </Flex>
                </div>

                {/* Net Balance Mini-Card */}
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: 10,
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap={8}>
                      <div
                        style={{
                          padding: 4,
                          borderRadius: 6,
                          backgroundColor: '#e2e8f0',
                          color: '#475569',
                          display: 'flex',
                        }}
                      >
                        <Wallet size={14} />
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Net Balance
                      </Text>
                    </Flex>
                    <Text
                      strong
                      style={{
                        color: net >= 0 ? '#16a34a' : '#dc2626',
                        fontSize: 14,
                      }}
                    >
                      {convertCurrency(net)}
                    </Text>
                  </Flex>
                </div>
              </div>
            </Flex>
          </Col>

          {/* Cột phải: Khu vực Chart với Animation */}
          <Col xs={24} md={14} lg={15}>
            <div style={{ width: '100%', height: 180, position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={chartType}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'bar' ? (
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <YAxis hide />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                        />
                        <Bar
                          dataKey="amount"
                          radius={[8, 8, 0, 0]}
                          barSize={36}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="amount"
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    )}
                  </ResponsiveContainer>

                  {/* Tâm Donut Chart hiển thị % Thu nhập */}
                  {chartType === 'pie' && totalVolume > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        pointerEvents: 'none',
                      }}
                    >
                      <Text
                        strong
                        style={{
                          fontSize: 16,
                          display: 'block',
                          lineHeight: 1,
                          color: '#10b981',
                        }}
                      >
                        {incomePercent}%
                      </Text>
                      <Text type="secondary" style={{ fontSize: 10 }}>
                        Income Ratio
                      </Text>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </Col>
        </Row>
      </Card>
    </motion.div>
  )
}
