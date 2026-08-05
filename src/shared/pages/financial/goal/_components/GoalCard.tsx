import React from 'react'
import {
  Avatar,
  Button,
  Card,
  Popconfirm,
  Progress,
  Space,
  Tag,
  Typography,
} from 'antd'
import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  RiseOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import type { IFinance_Goal } from '@/shared/api/financial/goal/goal.type'
import {
  FINANCIAL_GOAL_STATUS,
  FINANCIAL_GOAL_TYPE,
} from '@/shared/api/financial/goal/goal.enum'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Text, Title } = Typography

// Dynamic Label & Mapping cho Type khớp với Backend
const TYPE_LABELS: Record<FINANCIAL_GOAL_TYPE, string> = {
  [FINANCIAL_GOAL_TYPE.EMERGENCY_FUND]: 'Quỹ khẩn cấp',
  [FINANCIAL_GOAL_TYPE.BIG_PURCHASE]: 'Mua sắm lớn',
  [FINANCIAL_GOAL_TYPE.TRAVEL]: 'Du lịch',
  [FINANCIAL_GOAL_TYPE.OTHER]: 'Khác',
}

const TYPE_COLORS: Record<FINANCIAL_GOAL_TYPE, string> = {
  [FINANCIAL_GOAL_TYPE.EMERGENCY_FUND]: '#ef4444',
  [FINANCIAL_GOAL_TYPE.BIG_PURCHASE]: '#3b82f6',
  [FINANCIAL_GOAL_TYPE.TRAVEL]: '#10b981',
  [FINANCIAL_GOAL_TYPE.OTHER]: '#8b5cf6',
}

// Dynamic Mapping cho Status
const STATUS_COLORS: Record<FINANCIAL_GOAL_STATUS, string> = {
  [FINANCIAL_GOAL_STATUS.ACTIVE]: 'processing',
  [FINANCIAL_GOAL_STATUS.COMPLETED]: 'success',
  [FINANCIAL_GOAL_STATUS.PAUSED]: 'warning',
}

function daysLeft(deadline?: Date | string | null) {
  if (!deadline) return null
  const diff = new Date(deadline).getTime() - Date.now()
  return Math.ceil(diff / 86400000)
}

function monthsToComplete(
  current: number,
  target: number,
  autoSave?: number | null,
) {
  if (!autoSave || autoSave <= 0) return null
  const remaining = target - current
  if (remaining <= 0) return 0
  return Math.ceil(remaining / autoSave)
}

interface GoalCardProps {
  goal: IFinance_Goal
  onEdit: (g: IFinance_Goal) => void
  onDelete: (id: number) => void
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
}) => {
  const pct = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount)
  const days = daysLeft(goal.deadline)
  const months = monthsToComplete(
    goal.currentAmount,
    goal.targetAmount,
    goal.autoContributionAmount,
  )
  const done =
    goal.currentAmount >= goal.targetAmount ||
    goal.status === FINANCIAL_GOAL_STATUS.COMPLETED
  const goalColor = TYPE_COLORS[goal.type] || '#6366f1'
  const activeColor = done ? '#10b981' : goalColor

  return (
    <Card
      hoverable
      style={{ borderRadius: 16, height: '100%' }}
      styles={{
        body: {
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        },
      }}
    >
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Space size="middle">
          <Avatar
            src={goal.imageUrl || undefined}
            icon={!goal.imageUrl && <TrophyOutlined />}
            shape="square"
            size={44}
            style={{
              borderRadius: 12,
              backgroundColor: `${goalColor}20`,
              color: goalColor,
              fontSize: 20,
              flexShrink: 0,
            }}
          />
          <div>
            <Space size={6} align="center">
              <Text style={{ fontSize: 15, fontWeight: 600 }}>{goal.name}</Text>
              {goal.isLocked && (
                <LockOutlined style={{ color: '#ef4444', fontSize: 12 }} />
              )}
            </Space>
            <div style={{ marginTop: 2 }}>
              <Space size={4}>
                <Tag
                  color={goalColor}
                  style={{ borderRadius: 10, margin: 0, fontSize: 10 }}
                >
                  {TYPE_LABELS[goal.type] || goal.type}
                </Tag>
                <Tag
                  color={STATUS_COLORS[goal.status] || 'default'}
                  style={{
                    borderRadius: 10,
                    margin: 0,
                    fontSize: 10,
                    textTransform: 'capitalize',
                  }}
                >
                  {goal.status}
                </Tag>
              </Space>
            </div>
          </div>
        </Space>

        <Space size={4}>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#8c8c8c' }} />}
            onClick={() => onEdit(goal)}
          />
          <Popconfirm
            title="Xóa mục tiêu"
            description="Bạn có chắc chắn muốn xóa mục tiêu này?"
            onConfirm={() => onDelete(goal.id)}
            okText="Xóa"
            okButtonProps={{ danger: true }}
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      </div>

      {/* Progress Circle & Details */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Progress
          type="circle"
          percent={Math.round(pct)}
          size={72}
          strokeColor={activeColor}
          format={(p) => (
            <span
              style={{ fontSize: 12, fontWeight: 'bold', color: activeColor }}
            >
              {p}%
            </span>
          )}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <Title level={4} style={{ margin: 0, fontFamily: 'monospace' }}>
              {convertCurrency(goal.currentAmount)}
            </Title>
            <Text type="secondary" style={{ fontSize: 11 }}>
              / {convertCurrency(goal.targetAmount)}
            </Text>
          </div>

          <Progress
            percent={pct}
            showInfo={false}
            strokeColor={activeColor}
            size="small"
          />

          {!done ? (
            <Text type="secondary" style={{ fontSize: 11 }}>
              Còn {convertCurrency(remaining)}
            </Text>
          ) : (
            <Text type="success" style={{ fontSize: 11, fontWeight: 'bold' }}>
              Mục tiêu đã đạt được! 🎉
            </Text>
          )}
        </div>
      </div>

      {/* Meta Badges */}
      <Space wrap style={{ width: '100%' }}>
        {days !== null && (
          <Tag
            icon={<CalendarOutlined />}
            color={days < 30 ? 'error' : 'default'}
            style={{ borderRadius: 8, padding: '2px 8px' }}
          >
            {days > 0 ? `Còn ${days} ngày` : 'Quá hạn'}
          </Tag>
        )}
        {Boolean(goal.autoContributionAmount) && (
          <Tag
            icon={<ThunderboltOutlined style={{ color: '#f59e0b' }} />}
            style={{ borderRadius: 8, padding: '2px 8px' }}
          >
            {convertCurrency(goal.autoContributionAmount!)}/tháng
          </Tag>
        )}
        {Boolean(goal.autoContributionDay) && (
          <Tag
            icon={<SyncOutlined style={{ color: '#3b82f6' }} />}
            style={{ borderRadius: 8, padding: '2px 8px' }}
          >
            Ngày {goal.autoContributionDay}
          </Tag>
        )}
        {months !== null && months > 0 && (
          <Tag
            icon={<RiseOutlined style={{ color: '#10b981' }} />}
            style={{ borderRadius: 8, padding: '2px 8px' }}
          >
            ~{months} tháng
          </Tag>
        )}
      </Space>
    </Card>
  )
}
