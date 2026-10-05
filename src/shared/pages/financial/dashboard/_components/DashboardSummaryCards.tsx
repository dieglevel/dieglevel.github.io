import React from 'react'
import { Card, Col, Progress, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  ArrowDownRight,
  ArrowUpRight,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Text } = Typography

interface DashboardSummaryCardsProps {
  summary: {
    totalIncome: number
    totalExpense: number
    netBalance: number
    savingsRate: number
    totalWalletBalance: number
    pendingCount: number
  }
}

export const DashboardSummaryCards: React.FC<DashboardSummaryCardsProps> = ({
  summary,
}) => {
  const { t } = useTranslation('dashboard')

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {/* Total Income Card */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          style={{
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <Text
                type="secondary"
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                {t('summary.totalIncome')}
              </Text>
              <h2
                style={{
                  margin: '6px 0 0',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#16a34a',
                }}
              >
                {convertCurrency(summary.totalIncome)}
              </h2>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16a34a',
              }}
            >
              <ArrowUpRight size={22} />
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 12,
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <TrendingUp size={14} />
            <span>{t('summary.incomeDescription')}</span>
          </div>
        </Card>
      </Col>

      {/* Total Expense Card */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          style={{
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <Text
                type="secondary"
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                {t('summary.totalExpense')}
              </Text>
              <h2
                style={{
                  margin: '6px 0 0',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#dc2626',
                }}
              >
                {convertCurrency(summary.totalExpense)}
              </h2>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626',
              }}
            >
              <ArrowDownRight size={22} />
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 12,
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <TrendingDown size={14} />
            <span>{t('summary.expenseDescription')}</span>
          </div>
        </Card>
      </Col>

      {/* Net Savings Card */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          style={{
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <Text
                type="secondary"
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                {t('summary.netBalance')}
              </Text>
              <h2
                style={{
                  margin: '6px 0 0',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: summary.netBalance >= 0 ? '#0284c7' : '#dc2626',
                }}
              >
                {convertCurrency(summary.netBalance)}
              </h2>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284c7',
              }}
            >
              <Wallet size={22} />
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 12,
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{t('summary.totalWalletBalance')}</span>
            <span style={{ fontWeight: 600 }}>
              {convertCurrency(summary.totalWalletBalance)}
            </span>
          </div>
        </Card>
      </Col>

      {/* Savings Rate Card */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          style={{
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <Text
                type="secondary"
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                {t('summary.savingsRate')}
              </Text>
              <h2
                style={{
                  margin: '6px 0 0',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#4f46e5',
                }}
              >
                {summary.savingsRate}%
              </h2>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: '#e0e7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4f46e5',
              }}
            >
              <Target size={22} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <Progress
              percent={summary.savingsRate}
              showInfo={false}
              strokeColor="#4f46e5"
            />
          </div>
        </Card>
      </Col>
    </Row>
  )
}
