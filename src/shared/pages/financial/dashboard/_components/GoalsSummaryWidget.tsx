import React from 'react'
import { Button, Card, Empty, Progress, Space, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, Calendar, PlusCircle, Target } from 'lucide-react'
import dayjs from 'dayjs'
import type { GoalSummaryItem } from '@/shared/api/financial/dashboard/dashboard.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Text } = Typography

interface GoalsSummaryWidgetProps {
  goalsSummary: Array<GoalSummaryItem>
  onNavigateToGoals: () => void
}

export const GoalsSummaryWidget: React.FC<GoalsSummaryWidgetProps> = ({
  goalsSummary,
  onNavigateToGoals,
}) => {
  const { t } = useTranslation('dashboard')
  const { mode } = useThemeMode()
  const { border, state, radius, colors } = getTokens(mode)

  const getProgressColor = (pct: number) => {
    if (pct >= 100) return '#16a34a'
    if (pct >= 60) return colors.primary.base
    if (pct >= 30) return '#0284c7'
    return '#f59e0b'
  }

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: radius.md,
              background: `${colors.primary.base}18`,
              color: colors.primary.base,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Target size={18} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 600 }}>
            {t('goals.title')}
          </span>
        </div>
      }
      extra={
        <Button
          type="link"
          size="small"
          onClick={onNavigateToGoals}
          style={{
            color: colors.primary.base,
            fontSize: 13,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {t('goals.manage')}
          <ArrowUpRight size={14} />
        </Button>
      }
      style={{
        borderRadius: radius.lg,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      styles={{
        body: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 20px',
        },
      }}
    >
      {goalsSummary.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px 0',
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary" style={{ fontSize: 13 }}>
                {t('goals.empty')}
              </Text>
            }
          >
            <Button
              type="dashed"
              size="small"
              icon={<PlusCircle size={14} />}
              onClick={onNavigateToGoals}
              style={{ borderRadius: radius.sm, marginTop: 8 }}
            >
              {t('goals.createGoal')}
            </Button>
          </Empty>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {goalsSummary.map((goal) => {
            const pct = Math.min(100, Math.max(0, goal.percentage))
            const color = getProgressColor(pct)

            return (
              <div
                key={goal.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: radius.md,
                  border: `1px solid ${border.base}`,
                  background: state.hover,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 6,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {goal.name}
                    </div>
                    {goal.deadline && (
                      <Space
                        size={4}
                        style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}
                      >
                        <Calendar size={12} />
                        <span>
                          {t('goals.deadline')}:{' '}
                          {dayjs(goal.deadline).format('DD/MM/YYYY')}
                        </span>
                      </Space>
                    )}
                  </div>
                  <Tag
                    color={pct >= 100 ? 'success' : pct >= 60 ? 'processing' : 'warning'}
                    style={{
                      borderRadius: radius.sm,
                      margin: 0,
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    {pct}%
                  </Tag>
                </div>

                <Progress
                  percent={pct}
                  showInfo={false}
                  strokeColor={color}
                  size="small"
                  style={{ marginBottom: 6 }}
                />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: '#64748b' }}>
                    {t('goals.saved')}:{' '}
                    <strong style={{ color }}>
                      {convertCurrency(goal.currentAmount)}
                    </strong>
                  </span>
                  <span style={{ color: '#64748b' }}>
                    {t('goals.target')}:{' '}
                    <strong>{convertCurrency(goal.targetAmount)}</strong>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
