import { Card, Col, Row, Statistic } from 'antd'
import { useTranslation } from 'react-i18next'
import { convertCurrency } from '@/shared/utils/helper/format-money'

interface SummaryCardsProps {
  totalBudget: number
  totalSpent: number
}

export default function SummaryCards({
  totalBudget,
  totalSpent,
}: SummaryCardsProps) {
  const { t } = useTranslation('finance')
  const remaining = totalBudget - totalSpent

  return (
    <Row gutter={[12, 12]}>
      <Col xs={12} md={8}>
        <Card variant="borderless" size="small">
          <Statistic
            title={t('category.monthlyBudget')}
            value={convertCurrency(totalBudget)}
            precision={2}
            valueStyle={{ color: '#1677ff' }}
          />
        </Card>
      </Col>

      <Col xs={12} md={8}>
        <Card variant="borderless" size="small">
          <Statistic
            title={t('category.totalSpent')}
            value={convertCurrency(totalSpent)}
            precision={2}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>

      <Col xs={24} md={8}>
        <Card variant="borderless" size="small">
          <Statistic
            title={t('category.remaining')}
            value={convertCurrency(remaining)}
            precision={2}
            valueStyle={{
              color: remaining >= 0 ? '#52c41a' : '#ff4d4f',
            }}
          />
        </Card>
      </Col>
    </Row>
  )
}
