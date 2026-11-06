import React from 'react'
import { Button, Empty, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, PlusCircle, Target } from 'lucide-react'
import dayjs from 'dayjs'
import { WidgetCard } from './WidgetCard'
import { getVizColors } from './viz'
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
  const { border } = getTokens(mode)
  const viz = getVizColors(mode)

  return (
    <WidgetCard
      icon={<Target size={18} />}
      title={t('goals.title')}
      action={{ label: t('goals.manage'), onClick: onNavigateToGoals }}
    >
      {goalsSummary.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'grid',
            placeItems: 'center',
            padding: '24px 0',
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<Text type="secondary">{t('goals.empty')}</Text>}
          >
            <Button
              type="dashed"
              icon={<PlusCircle size={14} />}
              onClick={onNavigateToGoals}
            >
              {t('goals.createGoal')}
            </Button>
          </Empty>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {goalsSummary.map((goal, i) => {
            const pct = Math.min(100, Math.max(0, Math.round(goal.percentage)))
            const done = pct >= 100

            return (
              <li
                key={goal.id}
                style={{
                  padding: '12px 0',
                  borderTop: i === 0 ? 'none' : `1px solid ${border.light}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <Text strong ellipsis style={{ display: 'block' }}>
                      {goal.name}
                    </Text>
                    {goal.deadline && (
                      <Text type="secondary">
                        {t('goals.deadline')}:{' '}
                        {dayjs(goal.deadline).format('DD/MM/YYYY')}
                      </Text>
                    )}
                  </div>
                  {done ? (
                    <Tag
                      color="success"
                      icon={<CheckCircle2 size={12} aria-hidden />}
                      style={{
                        margin: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      {t('goals.completed')}
                    </Tag>
                  ) : (
                    <Text strong>{pct}%</Text>
                  )}
                </div>

                {/* Meter một màu — mức tiến độ đọc qua độ dài, không đổi màu theo % */}
                <div
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                  aria-label={goal.name}
                  style={{
                    height: 8,
                    margin: '8px 0 6px',
                    borderRadius: 4,
                    background: viz.meter.track,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      borderRadius: 4,
                      background: viz.meter.fill,
                    }}
                  />
                </div>

                <Text type="secondary">
                  {t('goals.progressLine', {
                    saved: convertCurrency(goal.currentAmount),
                    target: convertCurrency(goal.targetAmount),
                  })}
                </Text>
              </li>
            )
          })}
        </ul>
      )}
    </WidgetCard>
  )
}
