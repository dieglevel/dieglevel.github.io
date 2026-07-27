import React, { useState } from 'react'
import { Card, Col, Flex, Radio, Row, Statistic, Typography } from 'antd'
import { motion } from 'framer-motion'
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
import type { IWallet_Transaction } from '@/shared/api/financial/transaction/transaction.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Text } = Typography

interface TransactionsSummaryProps {
  transactions: Array<IWallet_Transaction>
}

export const TransactionsSummary: React.FC<TransactionsSummaryProps> = ({
  transactions,
}) => {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar')

  // Tính toán dữ liệu tài chính
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)

  const net = income - expense

  // Dữ liệu cho Recharts
  const chartData = [
    { name: 'Income', amount: income, color: '#10b981' },
    { name: 'Expense', amount: expense, color: '#f43f5e' },
  ]

  // Custom Tooltip hiển thị chuẩn định dạng tiền tệ
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '8px 12px',
            border: '1px solid #f0f0f0',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            {data.name}
          </Text>
          <div>
            <Text strong style={{ color: data.payload.color || data.color }}>
              {convertCurrency(data.value)}
            </Text>
          </div>
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
      <Card size="small" style={{ borderRadius: 12 }}>
        <Row gutter={[16, 16]} align="middle">
          {/* Cột trái: Thống kê số nhanh */}
          <Col xs={24} md={8}>
            <Flex vertical gap={12}>
              <Flex justify="space-between" align="center">
                <Text type="secondary" strong style={{ fontSize: 13 }}>
                  FINANCIAL OVERVIEW
                </Text>
                {/* Switch loại Chart */}
                <Radio.Group
                  size="small"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  optionType="button"
                  buttonStyle="solid"
                >
                  <Radio.Button value="bar">Bar</Radio.Button>
                  <Radio.Button value="pie">Pie</Radio.Button>
                </Radio.Group>
              </Flex>

              <Row gutter={[12, 12]}>
                <Col xs={8} md={24}>
                  <Statistic
                    title={
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Income
                      </Text>
                    }
                    value={convertCurrency(income)}
                    valueStyle={{
                      color: '#10b981',
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  />
                </Col>
                <Col xs={8} md={24}>
                  <Statistic
                    title={
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Expenses
                      </Text>
                    }
                    value={convertCurrency(expense)}
                    valueStyle={{
                      color: '#f43f5e',
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  />
                </Col>
                <Col xs={8} md={24}>
                  <Statistic
                    title={
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Net Balance
                      </Text>
                    }
                    value={convertCurrency(net)}
                    valueStyle={{
                      color: net >= 0 ? '#10b981' : '#f43f5e',
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  />
                </Col>
              </Row>
            </Flex>
          </Col>

          {/* Cột phải: Khu vực Chart */}
          <Col xs={24} md={16}>
            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#8c8c8c' }}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={40}>
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
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="amount"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>
      </Card>
    </motion.div>
  )
}
