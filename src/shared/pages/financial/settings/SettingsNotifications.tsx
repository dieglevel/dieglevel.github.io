import React from 'react'
import { Card, List, Space, Switch, Typography } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import type { NotificationSettings } from './types'

const { Text } = Typography

interface Props {
  notifications: NotificationSettings
  setNotifications: React.Dispatch<React.SetStateAction<NotificationSettings>>
}

const NOTIFICATION_LABELS: Record<
  keyof NotificationSettings,
  { label: string; sub: string }
> = {
  budgetAlerts: {
    label: 'Budget Alerts',
    sub: 'Notify when category budget is 80%+ used',
  },
  largeTransactions: {
    label: 'Large Transactions',
    sub: 'Alert for transactions over $200',
  },
  weeklyReport: { label: 'Weekly Summary', sub: 'Every Monday morning digest' },
  monthlyReport: {
    label: 'Monthly Report',
    sub: 'End-of-month financial summary',
  },
  unusualActivity: {
    label: 'Unusual Activity',
    sub: 'AI-detected spending anomalies',
  },
}

export const SettingsNotifications: React.FC<Props> = ({
  notifications,
  setNotifications,
}) => {
  const handleToggle = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <Card
      title={
        <Space>
          <BellOutlined style={{ color: '#1677ff' }} />
          <span>Notifications</span>
        </Space>
      }
    >
      <List itemLayout="horizontal">
        {(
          Object.keys(NOTIFICATION_LABELS) as Array<keyof NotificationSettings>
        ).map((key) => {
          const info = NOTIFICATION_LABELS[key]
          return (
            <List.Item
              key={key}
              extra={
                <Switch
                  checked={notifications[key]}
                  onChange={() => handleToggle(key)}
                />
              }
            >
              <List.Item.Meta
                title={info.label}
                description={<Text type="secondary">{info.sub}</Text>}
              />
            </List.Item>
          )
        })}
      </List>
    </Card>
  )
}
