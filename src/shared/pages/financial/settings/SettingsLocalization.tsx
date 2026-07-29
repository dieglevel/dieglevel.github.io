import React from 'react'
import { Card, List, Select, Space, Typography } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import { CURRENCIES, LANGUAGES } from './types'

const { Text } = Typography

interface Props {
  currency: string | null
  setCurrency: (val: string) => void
  language: string | null
  setLanguage: (val: string) => void
}

export const SettingsLocalization: React.FC<Props> = ({
  currency,
  setCurrency,
  language,
  setLanguage,
}) => {
  return (
    <Card
      title={
        <Space>
          <GlobalOutlined style={{ color: '#1677ff' }} />
          <span>Localization</span>
        </Space>
      }
    >
      <List itemLayout="horizontal">
        <List.Item
          extra={
            <Select
              value={currency}
              onChange={setCurrency}
              style={{ width: 220 }}
              options={CURRENCIES.map((c) => ({
                value: c.code,
                label: `${c.symbol} ${c.code} — ${c.name}`,
              }))}
            />
          }
        >
          <List.Item.Meta
            title="Currency"
            description={
              <Text type="secondary">Default currency for display</Text>
            }
          />
        </List.Item>

        <List.Item
          extra={
            <Select
              value={language}
              onChange={setLanguage}
              style={{ width: 160 }}
              options={LANGUAGES.map((l) => ({ value: l, label: l }))}
            />
          }
        >
          <List.Item.Meta
            title="Language"
            description={
              <Text type="secondary">Interface display language</Text>
            }
          />
        </List.Item>
      </List>
    </Card>
  )
}
