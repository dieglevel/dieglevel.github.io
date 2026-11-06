import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Col, Row, Typography } from 'antd'
import type { IFinance_Goal } from '@/shared/api/financial/goal/goal.type'
import {
  FINANCIAL_GOAL_SAVING_MODE,
  FINANCIAL_GOAL_STATUS,
} from '@/shared/api/financial/goal/goal.enum'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Title, Text } = Typography

interface GoalSummaryProps {
  goals: Array<IFinance_Goal>
}

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

/** 4 ô tổng quan. Không tính mục tiêu đã hủy vào tổng tiền. */
export function GoalSummary({ goals }: GoalSummaryProps) {
  const { t } = useTranslation('finance')
  const { mode } = useThemeMode()
  const { colors } = getTokens(mode)

  const s = useMemo(() => {
    const counted = goals.filter(
      (g) => g.status !== FINANCIAL_GOAL_STATUS.CANCELLED,
    )
    const totalTarget = counted.reduce(
      (sum, g) => sum + Number(g.targetAmount || 0),
      0,
    )
    const totalCurrent = counted.reduce(
      (sum, g) => sum + Number(g.currentAmount || 0),
      0,
    )
    const count = (st: FINANCIAL_GOAL_STATUS) =>
      goals.filter((g) => g.status === st).length
    const autoGoals = goals.filter(
      (g) =>
        g.status === FINANCIAL_GOAL_STATUS.ACTIVE &&
        g.savingMode === FINANCIAL_GOAL_SAVING_MODE.AUTO,
    )
    return {
      totalTarget,
      totalCurrent,
      percent:
        totalTarget > 0
          ? Math.min(100, Math.round((totalCurrent / totalTarget) * 100))
          : 0,
      active: count(FINANCIAL_GOAL_STATUS.ACTIVE),
      paused: count(FINANCIAL_GOAL_STATUS.INACTIVE),
      completed: count(FINANCIAL_GOAL_STATUS.COMPLETED),
      monthlyAuto: autoGoals.reduce(
        (sum, g) => sum + Number(g.autoContributionAmount || 0),
        0,
      ),
      autoCount: autoGoals.length,
    }
  }, [goals])

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} xl={9}>
        <Tile>
          <Text type="secondary">{t('goal.sumSaved')}</Text>
          <Title level={3} style={{ margin: 0 }}>
            {convertCurrency(s.totalCurrent)}
          </Title>
          <div style={{ marginTop: 'auto', paddingTop: 8 }}>
            <div
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={s.percent}
              aria-label={t('goal.sumSaved')}
              style={{
                height: 8,
                borderRadius: 4,
                background: colors.primary.soft,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${s.percent}%`,
                  height: '100%',
                  borderRadius: 4,
                  background: colors.primary.base,
                }}
              />
            </div>
            <Text type="secondary" style={{ display: 'block', marginTop: 6 }}>
              {t('goal.sumOfTarget', {
                percent: s.percent,
                target: convertCurrency(s.totalTarget),
              })}
            </Text>
          </div>
        </Tile>
      </Col>
      <Col xs={12} sm={12} xl={5}>
        <Tile>
          <Text type="secondary">{t('goal.sumActive')}</Text>
          <Title level={3} style={{ margin: 0 }}>
            {s.active}
          </Title>
          <Text type="secondary" style={{ marginTop: 'auto' }}>
            {s.paused > 0 ? t('goal.sumPaused', { count: s.paused }) : ' '}
          </Text>
        </Tile>
      </Col>
      <Col xs={12} sm={12} xl={5}>
        <Tile>
          <Text type="secondary">{t('goal.sumCompleted')}</Text>
          <Title level={3} style={{ margin: 0 }}>
            {s.completed}
          </Title>
          <Text type="secondary" style={{ marginTop: 'auto' }}>
            {t('goal.sumOfAll', { count: goals.length })}
          </Text>
        </Tile>
      </Col>
      <Col xs={24} sm={12} xl={5}>
        <Tile>
          <Text type="secondary">{t('goal.sumMonthly')}</Text>
          <Title level={3} style={{ margin: 0 }}>
            {convertCurrency(s.monthlyAuto)}
          </Title>
          <Text type="secondary" style={{ marginTop: 'auto' }}>
            {t('goal.sumMonthlyHint', { count: s.autoCount })}
          </Text>
        </Tile>
      </Col>
    </Row>
  )
}
