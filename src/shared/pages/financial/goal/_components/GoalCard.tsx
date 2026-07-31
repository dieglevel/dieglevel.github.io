import React from 'react'
import {
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
  ThunderboltOutlined,
} from '@ant-design/icons'
import type { IWallet_Goal } from '@/shared/api/financial/goal/goal.type'

const { Text, Title } = Typography

const TYPE_LABELS: Record<IWallet_Goal['type'], string> = {
  emergency: 'Emergency Fund',
  bigpurchase: 'Big Purchase',
  travel: 'Travel',
  custom: 'Custom',
}

const TYPE_COLORS: Record<IWallet_Goal['type'], string> = {
  emergency: '#ef4444',
  bigpurchase: '#3b82f6',
  travel: '#10b981',
  custom: '#8b5cf6',
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

function daysLeft(deadline?: string) {
  if (!deadline) return null
  const diff = new Date(deadline).getTime() - Date.now()
  return Math.ceil(diff / 86400000)
}

function monthsToComplete(current: number, target: number, autoSave?: number) {
  if (!autoSave || autoSave <= 0) return null
  const remaining = target - current
  if (remaining <= 0) return 0
  return Math.ceil(remaining / autoSave)
}

interface GoalCardProps {
  goal: IWallet_Goal
  onEdit: (g: IWallet_Goal) => void
  onDelete: (id: string) => void
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
}) => {
  const pct = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
  const remaining = goal.targetAmount - goal.currentAmount
  const days = daysLeft(goal.deadline)
  const months = monthsToComplete(
    goal.currentAmount,
    goal.targetAmount,
    goal.autoSave,
  )
  const done = goal.currentAmount >= goal.targetAmount
  const activeColor = done ? '#10b981' : goal.color

  return (
    <Card
      hoverable
      style={{ borderRadius: 16, height: '100%' }}
      bodyStyle={{
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
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
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              backgroundColor: `${goal.color}20`,
            }}
          >
            {goal.icon}
          </div>
          <div>
            <Space size={6} align="center">
              <Text style={{ fontSize: 15 }}>{goal.name}</Text>
              {goal.locked && (
                <LockOutlined style={{ color: '#ef4444', fontSize: 12 }} />
              )}
            </Space>
            <div>
              <Tag
                color={TYPE_COLORS[goal.type]}
                style={{ borderRadius: 10, margin: 0, fontSize: 10 }}
              >
                {TYPE_LABELS[goal.type]}
              </Tag>
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
            title="Delete Goal"
            description="Are you sure you want to delete this goal?"
            onConfirm={() => onDelete(goal.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
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
              {fmt(goal.currentAmount)}
            </Title>
            <Text type="secondary" style={{ fontSize: 11 }}>
              of {fmt(goal.targetAmount)}
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
              {fmt(remaining)} remaining
            </Text>
          ) : (
            <Text type="success" style={{ fontSize: 11, fontWeight: 'bold' }}>
              Goal achieved! 🎉
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
            {days > 0 ? `${days}d left` : 'Overdue'}
          </Tag>
        )}
        {goal.autoSave && (
          <Tag
            icon={<ThunderboltOutlined style={{ color: '#f59e0b' }} />}
            style={{ borderRadius: 8, padding: '2px 8px' }}
          >
            {fmt(goal.autoSave)}/mo
          </Tag>
        )}
        {months !== null && months > 0 && (
          <Tag
            icon={<RiseOutlined style={{ color: '#10b981' }} />}
            style={{ borderRadius: 8, padding: '2px 8px' }}
          >
            ~{months}mo
          </Tag>
        )}
      </Space>

      {/* Description */}
      {goal.description && (
        <Text
          type="secondary"
          style={{ fontSize: 11 }}
          ellipsis={{ tooltip: goal.description }}
        >
          {goal.description}
        </Text>
      )}
    </Card>
  )
}
