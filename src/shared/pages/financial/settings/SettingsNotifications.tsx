import React from 'react'
import { Card, List, Space, Switch, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { BellOutlined } from '@ant-design/icons'
import type { NotificationSettings } from './types'

const { Text } = Typography

interface Props {
  notifications: NotificationSettings
  setNotifications: React.Dispatch<React.SetStateAction<NotificationSettings>>
}

const NOTIFICATION_LABELS = {
  budgetAlerts: {
    label: 'notifications.budgetAlerts.label',
    description: 'notifications.budgetAlerts.description',
  },
  largeTransactions: {
    label: 'notifications.largeTransactions.label',
    description: 'notifications.largeTransactions.description',
  },
  weeklyReport: {
    label: 'notifications.weeklyReport.label',
    description: 'notifications.weeklyReport.description',
  },
  monthlyReport: {
    label: 'notifications.monthlyReport.label',
    description: 'notifications.monthlyReport.description',
  },
  unusualActivity: {
    label: 'notifications.unusualActivity.label',
    description: 'notifications.unusualActivity.description',
  },
} as const

export const SettingsNotifications: React.FC<Props> = ({
  notifications,
  setNotifications,
}) => {
  const { t } = useTranslation('settings')

  const handleToggle = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <Card
      title={
        <Space>
          <BellOutlined style={{ color: '#1677ff' }} />
          <span>{t('notifications.title')}</span>
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
                title={t(info.label)}
                description={
                  <Text type="secondary">{t(info.description)}</Text>
                }
              />
            </List.Item>
          )
        })}
      </List>
    </Card>
  )
}
