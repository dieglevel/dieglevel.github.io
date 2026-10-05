import React from 'react'
import { Button, Card, List, Select, Space, Switch, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { RightOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import type { SecuritySettings } from './types'

const { Text } = Typography

interface Props {
  security: SecuritySettings
  setSecurity: React.Dispatch<React.SetStateAction<SecuritySettings>>
}

export const SettingsSecurity: React.FC<Props> = ({
  security,
  setSecurity,
}) => {
  const { t } = useTranslation('settings')

  return (
    <Card
      title={
        <Space>
          <SafetyCertificateOutlined style={{ color: '#1677ff' }} />
          <span>{t('security.title')}</span>
        </Space>
      }
    >
      <List itemLayout="horizontal">
        <List.Item
          extra={
            <Switch
              checked={security.twoFactor}
              onChange={(val) => setSecurity((s) => ({ ...s, twoFactor: val }))}
            />
          }
        >
          <List.Item.Meta
            title={t('security.twoFactor')}
            description={
              <Text type="secondary">{t('security.twoFactorDescription')}</Text>
            }
          />
        </List.Item>

        <List.Item
          extra={
            <Switch
              checked={security.biometric}
              onChange={(val) => setSecurity((s) => ({ ...s, biometric: val }))}
            />
          }
        >
          <List.Item.Meta
            title={t('security.biometric')}
            description={
              <Text type="secondary">{t('security.biometricDescription')}</Text>
            }
          />
        </List.Item>

        <List.Item
          extra={
            <Select
              value={security.sessionTimeout}
              onChange={(val) =>
                setSecurity((s) => ({ ...s, sessionTimeout: val }))
              }
              style={{ width: 140 }}
              options={[
                { value: '15min', label: t('security.minutes', { count: 15 }) },
                { value: '30min', label: t('security.minutes', { count: 30 }) },
                { value: '1hr', label: t('security.hour') },
                { value: 'never', label: t('security.never') },
              ]}
            />
          }
        >
          <List.Item.Meta
            title={t('security.sessionTimeout')}
            description={
              <Text type="secondary">
                {t('security.sessionTimeoutDescription')}
              </Text>
            }
          />
        </List.Item>

        <List.Item
          extra={
            <Button type="link">
              {t('security.update')} <RightOutlined />
            </Button>
          }
        >
          <List.Item.Meta
            title={t('security.changePassword')}
            description={
              <Text type="secondary">
                {t('security.changePasswordDescription')}
              </Text>
            }
          />
        </List.Item>
      </List>
    </Card>
  )
}
