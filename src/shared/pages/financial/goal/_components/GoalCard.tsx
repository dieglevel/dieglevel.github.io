import React from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar, Button, Card, Dropdown, Tag, Tooltip, Typography } from 'antd'
import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  MoreOutlined,
  SyncOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import {
  canContribute,
  daysToDeadline,
  estimateMonths,
  goalAmounts,
} from '../goal.utils'
import type { MenuProps } from 'antd'
import type { IFinance_Goal } from '@/shared/api/financial/goal/goal.type'
import {
  FINANCIAL_GOAL_SAVING_MODE,
  FINANCIAL_GOAL_STATUS,
  FinancialGoalStatusHelper,
  FinancialGoalTypeHelper,
} from '@/shared/api/financial/goal/goal.enum'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Text, Title } = Typography

/** Số ngày còn lại được coi là "sắp đến hạn" */
const DUE_SOON_DAYS = 30

interface GoalCardProps {
  goal: IFinance_Goal
  onView: (g: IFinance_Goal) => void
  onEdit: (g: IFinance_Goal) => void
  onDelete: (g: IFinance_Goal) => void
  onContribute: (g: IFinance_Goal) => void
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onView,
  onEdit,
  onDelete,
  onContribute,
}) => {
  const { t } = useTranslation('finance')
  const { mode } = useThemeMode()
  const { colors, radius } = getTokens(mode)

  const { current, target, remaining, percent } = goalAmounts(goal)
  const days = daysToDeadline(goal)
  const months = estimateMonths(goal)
  const isAuto = goal.savingMode === FINANCIAL_GOAL_SAVING_MODE.AUTO
  const done = goal.status === FINANCIAL_GOAL_STATUS.COMPLETED
  const closed =
    goal.status === FINANCIAL_GOAL_STATUS.CANCELLED ||
    goal.status === FINANCIAL_GOAL_STATUS.INACTIVE
  const accent = done ? colors.success : colors.primary

  const menu: MenuProps['items'] = [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: t('goal.viewDetail'),
      onClick: () => onView(goal),
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: t('common.edit'),
      onClick: () => onEdit(goal),
    },
    { type: 'divider' },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: t('common.delete'),
      danger: true,
      onClick: () => onDelete(goal),
    },
  ]

  const deadlineTag = () => {
    if (
      days === null ||
      done ||
      goal.status === FINANCIAL_GOAL_STATUS.CANCELLED
    )
      return null
    const color =
      days < 0 ? 'error' : days <= DUE_SOON_DAYS ? 'warning' : undefined
    return (
      <Tag icon={<CalendarOutlined />} color={color} style={{ margin: 0 }}>
        {days < 0 ? t('goal.overdue') : t('goal.daysRemaining', { days })}
      </Tag>
    )
  }

  return (
    <Card
      hoverable
      role="button"
      tabIndex={0}
      aria-label={goal.name}
      onClick={() => onView(goal)}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && e.key === 'Enter') onView(goal)
      }}
      style={{
        borderRadius: radius.lg,
        height: '100%',
        opacity: closed ? 0.72 : 1,
      }}
      styles={{
        body: {
          padding: 20,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        },
      }}
    >
      {/* Đầu thẻ: ảnh/biểu tượng, tên, loại, trạng thái, menu */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Avatar
          shape="square"
          size={44}
          src={goal.imageUrl || undefined}
          icon={!goal.imageUrl && <TrophyOutlined />}
          style={{
            flexShrink: 0,
            borderRadius: radius.md,
            background: accent.soft,
            color: accent.text,
          }}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Text strong ellipsis={{ tooltip: goal.name }}>
              {goal.name}
            </Text>
            {goal.isLocked && (
              <Tooltip title={t('goal.locked')}>
                <LockOutlined aria-label={t('goal.locked')} />
              </Tooltip>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Text type="secondary">
              {FinancialGoalTypeHelper.getLabel(goal.type)}
            </Text>
            {goal.status !== FINANCIAL_GOAL_STATUS.ACTIVE && (
              <Tag
                color={FinancialGoalStatusHelper.getColor(goal.status)}
                style={{ margin: 0 }}
              >
                {FinancialGoalStatusHelper.getLabel(goal.status)}
              </Tag>
            )}
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown trigger={['click']} menu={{ items: menu }}>
            <Button
              type="text"
              aria-label={t('goal.moreActions', { name: goal.name })}
              icon={<MoreOutlined />}
            />
          </Dropdown>
        </div>
      </div>

      {/* Số tiền + thanh tiến độ */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 8,
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            {convertCurrency(current)}
          </Title>
          <Text strong>{Math.round(percent)}%</Text>
        </div>
        <Text type="secondary">
          {t('goal.ofTarget', { target: convertCurrency(target) })}
        </Text>
        <div
          role="meter"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percent)}
          aria-label={goal.name}
          style={{
            height: 8,
            marginTop: 8,
            borderRadius: 4,
            background: accent.soft,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: '100%',
              borderRadius: 4,
              background: accent.base,
            }}
          />
        </div>
        <Text
          type={done ? 'success' : 'secondary'}
          style={{ display: 'block', marginTop: 6 }}
        >
          {done || remaining === 0
            ? t('goal.achieved')
            : t('goal.remaining', { amount: convertCurrency(remaining) })}
        </Text>
      </div>

      {/* Thông tin phụ */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {deadlineTag()}
        {isAuto && goal.autoContributionAmount ? (
          <Tag icon={<SyncOutlined />} style={{ margin: 0 }}>
            {t('goal.perMonth', {
              amount: convertCurrency(goal.autoContributionAmount),
            })}
            {goal.autoContributionDay
              ? ` · ${t('goal.dayShort', { day: goal.autoContributionDay })}`
              : ''}
          </Tag>
        ) : null}
        {months !== null && months > 0 && !closed && (
          <Tag style={{ margin: 0 }}>{t('goal.monthsShort', { months })}</Tag>
        )}
      </div>

      {/* Góp nhanh */}
      {canContribute(goal) && (
        <Button
          block
          style={{ marginTop: 'auto' }}
          onClick={(e) => {
            e.stopPropagation()
            onContribute(goal)
          }}
        >
          {t('goal.contribute')}
        </Button>
      )}
    </Card>
  )
}
