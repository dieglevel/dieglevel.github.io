import { Card, Col, Row, Statistic } from 'antd'

interface SummaryCardsProps {
  totalBudget: number
  totalSpent: number
}

export default function SummaryCards({
  totalBudget,
  totalSpent,
}: SummaryCardsProps) {
  const remaining = totalBudget - totalSpent

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <Card bordered={false}>
          <Statistic
            title="Total Budget"
            value={totalBudget}
            precision={2}
            prefix="$"
            valueStyle={{
              color: '#1677ff',
            }}
          />
        </Card>
      </Col>

      <Col xs={24} md={8}>
        <Card bordered={false}>
          <Statistic
            title="Total Spent"
            value={totalSpent}
            precision={2}
            prefix="$"
            valueStyle={{
              color: '#ff4d4f',
            }}
          />
        </Card>
      </Col>

      <Col xs={24} md={8}>
        <Card bordered={false}>
          <Statistic
            title="Remaining"
            value={remaining}
            precision={2}
            prefix="$"
            valueStyle={{
              color: remaining >= 0 ? '#52c41a' : '#ff4d4f',
            }}
          />
        </Card>
      </Col>
    </Row>
  )
}
