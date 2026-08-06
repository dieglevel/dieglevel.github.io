import React, { useMemo } from 'react'
import { Card, Col, Row, Statistic, Typography } from 'antd'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import type { IFinanceRecurring } from '..'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Text } = Typography

interface RecurringSummaryProps {
  rules: Array<IFinanceRecurring>
}

export function RecurringSummary({ rules }: RecurringSummaryProps) {
  // Tính tổng ước tính Thu/Chi cố định theo tháng
  const summary = useMemo(() => {
    let totalExpense = 0
    let totalIncome = 0
    let activeCount = 0

    rules.forEach((rule) => {
      if (!rule.isActive) return
      activeCount++

      if (rule.transactionType === 'expense') {
        totalExpense += rule.amount
      } else {
        totalIncome += rule.amount
      }
    })

    return { totalExpense, totalIncome, activeCount }
  }, [rules])

  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} sm={8}>
        <Card size="small" styles={{ body: { padding: '12px 16px' } }}>
          <Statistic
            title={
              <Text type="secondary" style={{ fontSize: 12 }}>
                TỔNG ĐỊNH KỲ DỰ KIẾN CHI
              </Text>
            }
            value={summary.totalExpense}
            formatter={(value) => (
              <Text style={{ color: '#ef4444', fontWeight: 700, fontSize: 18 }}>
                -{convertCurrency(Number(value))}
              </Text>
            )}
            prefix={<ArrowDownOutlined style={{ color: '#ef4444' }} />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={8}>
        <Card size="small" styles={{ body: { padding: '12px 16px' } }}>
          <Statistic
            title={
              <Text type="secondary" style={{ fontSize: 12 }}>
                TỔNG ĐỊNH KỲ DỰ KIẾN THU
              </Text>
            }
            value={summary.totalIncome}
            formatter={(value) => (
              <Text style={{ color: '#10b981', fontWeight: 700, fontSize: 18 }}>
                +{convertCurrency(Number(value))}
              </Text>
            )}
            prefix={<ArrowUpOutlined style={{ color: '#10b981' }} />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={8}>
        <Card size="small" styles={{ body: { padding: '12px 16px' } }}>
          <Statistic
            title={
              <Text type="secondary" style={{ fontSize: 12 }}>
                QUY TẮC ĐANG HOẠT ĐỘNG
              </Text>
            }
            value={summary.activeCount}
            suffix={`/ ${rules.length}`}
            formatter={(value) => (
              <Text style={{ fontWeight: 700, fontSize: 18 }}>{value}</Text>
            )}
            prefix={<SyncOutlined spin style={{ color: '#1677ff' }} />}
          />
        </Card>
      </Col>
    </Row>
  )
}
