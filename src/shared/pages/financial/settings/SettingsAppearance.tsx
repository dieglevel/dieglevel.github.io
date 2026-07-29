import React from 'react'
import { Card, List, Segmented, Space, Typography } from 'antd'
import { BgColorsOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'

const { Text } = Typography

interface Props {
  isDark: boolean
  toggleDark: () => void
}

export const SettingsAppearance: React.FC<Props> = ({ isDark, toggleDark }) => {
  return (
    <Card
      title={
        <Space>
          <BgColorsOutlined style={{ color: '#1677ff' }} />
          <span>Appearance</span>
        </Space>
      }
    >
      <List itemLayout="horizontal">
        <List.Item
          extra={
            <Segmented
              value={isDark ? 'dark' : 'light'}
              onChange={toggleDark}
              options={[
                { label: 'Light', value: 'light', icon: <SunOutlined /> },
                { label: 'Dark', value: 'dark', icon: <MoonOutlined /> },
              ]}
            />
          }
        >
          <List.Item.Meta
            title="Color Theme"
            description={
              <Text type="secondary">
                Switch between light and dark interface
              </Text>
            }
          />
        </List.Item>
      </List>
    </Card>
  )
}
