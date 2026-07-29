import React from 'react'
import { Button, Card, List, Select, Space, Switch, Typography } from 'antd'
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
  return (
    <Card
      title={
        <Space>
          <SafetyCertificateOutlined style={{ color: '#1677ff' }} />
          <span>Security</span>
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
            title="Two-Factor Authentication"
            description={
              <Text type="secondary">Add an extra layer of security</Text>
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
            title="Biometric Login"
            description={
              <Text type="secondary">Use fingerprint or Face ID</Text>
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
                { value: '15min', label: '15 minutes' },
                { value: '30min', label: '30 minutes' },
                { value: '1hr', label: '1 hour' },
                { value: 'never', label: 'Never' },
              ]}
            />
          }
        >
          <List.Item.Meta
            title="Session Timeout"
            description={
              <Text type="secondary">Auto-logout after inactivity</Text>
            }
          />
        </List.Item>

        <List.Item
          extra={
            <Button type="link">
              Update <RightOutlined />
            </Button>
          }
        >
          <List.Item.Meta
            title="Change Password"
            description={<Text type="secondary">Last changed 45 days ago</Text>}
          />
        </List.Item>
      </List>
    </Card>
  )
}
