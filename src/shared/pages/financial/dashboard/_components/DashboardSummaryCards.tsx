import React from 'react'
import { Card, Col, Row, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { Clock } from 'lucide-react'
import { Sparkline } from './Sparkline'
import { getVizColors } from './viz'
import type { CashFlowTimelinePoint } from '@/shared/api/financial/dashboard/dashboard.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Title, Text } = Typography

interface DashboardSummaryCardsProps {
  summary: {
    totalIncome: number
    totalExpense: number
    netBalance: number
    savingsRate: number
    totalWalletBalance: number
    pendingCount: number
  }
  cashFlowTimeline: Array<CashFlowTimelinePoint>
}

/** Ô màu nhỏ đánh dấu series — màu nằm ở dấu, chữ vẫn dùng màu chữ */
const Swatch: React.FC<{ color: string }> = ({ color }) => (
  <span
    aria-hidden
    style={{
      display: 'inline-block',
      width: 10,
      height: 10,
      borderRadius: 3,
      background: color,
      marginRight: 6,
    }}
  />
)

const Tile: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode } = useThemeMode()
  const { radius } = getTokens(mode)
  return (
    <Card
      style={{ borderRadius: radius.lg, height: '100%' }}
      styles={{
        body: {
          padding: 20,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        },
      }}
    >
      {children}
    </Card>
  )
}

export const DashboardSummaryCards: React.FC<DashboardSummaryCardsProps> = ({
  summary,
  cashFlowTimeline,
}) => {
  const { t } = useTranslation('dashboard')
  const { mode } = useThemeMode()
  const viz = getVizColors(mode)

  const incomeSeries = cashFlowTimeline.map((p) => Number(p.income || 0))
  const expenseSeries = cashFlowTimeline.map((p) => Number(p.expense || 0))
  const net = Number(summary.netBalance || 0)
  const rate = Math.round(Number(summary.savingsRate || 0))
  const meterPct = Math.min(100, Math.max(0, rate))

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      {/* 1. Tổng số dư ví — con số dẫn đầu */}
      <Col xs={24} sm={12} xl={6}>
        <Tile>
          <Text type="secondary">{t('summary.walletBalance')}</Text>
          <Title level={3} style={{ margin: 0 }}>
            {convertCurrency(summary.totalWalletBalance)}
          </Title>
          <div style={{ marginTop: 'auto', paddingTop: 8 }}>
            {summary.pendingCount > 0 ? (
              <Tag
                color="warning"
                icon={<Clock size={12} aria-hidden />}
                style={{
                  margin: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {t('summary.pending', { count: summary.pendingCount })}
              </Tag>
            ) : (
              <Text type="secondary">{t('summary.walletBalanceHint')}</Text>
            )}
          </div>
        </Tile>
      </Col>

      {/* 2. Thu nhập + xu hướng */}
      <Col xs={24} sm={12} xl={6}>
        <Tile>
          <Text type="secondary">
            <Swatch color={viz.income} />
            {t('summary.totalIncome')}
          </Text>
          <Title level={4} style={{ margin: 0 }}>
            {convertCurrency(summary.totalIncome)}
          </Title>
          <div style={{ marginTop: 'auto', paddingTop: 8 }}>
            <Sparkline
              values={incomeSeries}
              color={viz.income}
              ariaLabel={t('summary.incomeTrend')}
            />
          </div>
        </Tile>
      </Col>

      {/* 3. Chi tiêu + xu hướng */}
      <Col xs={24} sm={12} xl={6}>
        <Tile>
          <Text type="secondary">
            <Swatch color={viz.expense} />
            {t('summary.totalExpense')}
          </Text>
          <Title level={4} style={{ margin: 0 }}>
            {convertCurrency(summary.totalExpense)}
          </Title>
          <div style={{ marginTop: 'auto', paddingTop: 8 }}>
            <Sparkline
              values={expenseSeries}
              color={viz.expense}
              ariaLabel={t('summary.expenseTrend')}
            />
          </div>
        </Tile>
      </Col>

      {/* 4. Còn lại (thu − chi) + meter tỷ lệ tích lũy */}
      <Col xs={24} sm={12} xl={6}>
        <Tile>
          <Text type="secondary">{t('summary.netBalance')}</Text>
          <Title
            level={4}
            type={net < 0 ? 'danger' : undefined}
            style={{ margin: 0 }}
          >
            {net > 0 ? '+' : net < 0 ? '−' : ''}
            {convertCurrency(Math.abs(net))}
          </Title>
          <div style={{ marginTop: 'auto', paddingTop: 8 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <Text type="secondary">{t('summary.savingsRate')}</Text>
              <Text strong>{rate}%</Text>
            </div>
            <div
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={meterPct}
              aria-label={t('summary.savingsRate')}
              style={{
                height: 8,
                borderRadius: 4,
                background: viz.meter.track,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${meterPct}%`,
                  height: '100%',
                  borderRadius: 4,
                  background: viz.meter.fill,
                }}
              />
            </div>
          </div>
        </Tile>
      </Col>
    </Row>
  )
}
