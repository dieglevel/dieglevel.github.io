import React, { useMemo } from 'react'
import { Card, Col, Progress, Row, Statistic, Typography } from 'antd'
import { AimOutlined, TrophyOutlined } from '@ant-design/icons'
import type { IFinance_Goal } from '@/shared/api/financial/goal/goal.type'
import { FINANCIAL_GOAL_STATUS } from '@/shared/api/financial/goal/goal.enum'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Text } = Typography

interface GoalSummaryProps {
  goals: Array<IFinance_Goal>
}

export function GoalSummary({ goals }: GoalSummaryProps) {
  const summary = useMemo(() => {
    let totalTarget = 0
    let totalCurrent = 0
    let completedCount = 0

    goals.forEach((item) => {
      totalTarget += Number(item.targetAmount || 0)
      totalCurrent += Number(item.currentAmount || 0)
      if (item.status === FINANCIAL_GOAL_STATUS.COMPLETED) {
        completedCount++
      }
    })

    const overallProgress =
      totalTarget > 0
        ? Math.min(Number(((totalCurrent / totalTarget) * 100).toFixed(1)), 100)
        : 0

    return { totalTarget, totalCurrent, completedCount, overallProgress }
  }, [goals])

  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} sm={8}>
        <Card size="small" styles={{ body: { padding: '12px 16px' } }}>
          <Statistic
            title={
              <Text type="secondary" style={{ fontSize: 12 }}>
                TỔNG ĐÃ TÍCH LŨY
              </Text>
            }
            value={summary.totalCurrent}
            formatter={(value) => (
              <Text style={{ color: '#10b981', fontWeight: 700, fontSize: 18 }}>
                {convertCurrency(Number(value))}
              </Text>
            )}
            prefix={<TrophyOutlined style={{ color: '#10b981' }} />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={8}>
        <Card size="small" styles={{ body: { padding: '12px 16px' } }}>
          <Statistic
            title={
              <Text type="secondary" style={{ fontSize: 12 }}>
                TỔNG MỤC TIÊU ĐẶT RA
              </Text>
            }
            value={summary.totalTarget}
            formatter={(value) => (
              <Text style={{ fontWeight: 700, fontSize: 18 }}>
                {convertCurrency(Number(value))}
              </Text>
            )}
            prefix={<AimOutlined style={{ color: '#1677ff' }} />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={8}>
        <Card size="small" styles={{ body: { padding: '12px 16px' } }}>
          <div>
            <Text
              type="secondary"
              style={{ fontSize: 12, display: 'block', marginBottom: 4 }}
            >
              TIẾN ĐỘ TỔNG THỂ
            </Text>
            <Progress
              percent={summary.overallProgress}
              size="small"
              strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
            />
          </div>
        </Card>
      </Col>
    </Row>
  )
}
